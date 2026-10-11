import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "@/app/version.json/route";
import { SITE_LAST_MODIFIED, SITE_URL } from "./constants";

const { execFileSync } = vi.hoisted(() => ({ execFileSync: vi.fn() }));
vi.mock("node:child_process", () => ({
  execFileSync,
  default: { execFileSync },
}));

beforeEach(() => {
  execFileSync.mockReset();
  vi.stubEnv("CF_PAGES_COMMIT_SHA", "");
  vi.stubEnv("GITHUB_SHA", "");
});
afterEach(() => vi.unstubAllEnvs());

describe("public deployment fingerprint", () => {
  it("uses a bounded shell-free git lookup and the shared site identity", async () => {
    const sha = "a".repeat(40);
    execFileSync.mockReturnValue(Buffer.from(sha + "\n"));
    const response = GET();
    const version = await response.json();
    expect(version).toMatchObject({
      commit: sha,
      contentRevision: SITE_LAST_MODIFIED,
      site: SITE_URL,
    });
    expect(Number.isFinite(Date.parse(version.builtAt))).toBe(true);
    expect(execFileSync).toHaveBeenCalledWith(
      "git",
      ["rev-parse", "HEAD"],
      expect.objectContaining({ timeout: 2_000, maxBuffer: 4_096 }),
    );
    expect(response.headers.get("content-type")).toBe(
      "application/json; charset=utf-8",
    );
  });

  it("falls back to a valid CI commit when git is unavailable", async () => {
    execFileSync.mockImplementation(() => {
      throw new Error("git unavailable");
    });
    vi.stubEnv("CF_PAGES_COMMIT_SHA", "B".repeat(40));
    expect((await GET().json()).commit).toBe("b".repeat(40));
  });

  it("ignores empty or malformed candidates before checking the next source", async () => {
    execFileSync.mockReturnValue(Buffer.from("not-a-commit"));
    vi.stubEnv("CF_PAGES_COMMIT_SHA", "invalid environment text");
    vi.stubEnv("GITHUB_SHA", "c".repeat(40));
    const version = await GET().json();
    expect(version.commit).toBe("c".repeat(40));
    expect(JSON.stringify(version)).not.toContain("invalid environment text");
  });

  it("reports unknown instead of publishing arbitrary environment values", async () => {
    execFileSync.mockImplementation(() => {
      throw new Error("git unavailable");
    });
    vi.stubEnv("CF_PAGES_COMMIT_SHA", "invalid environment text");
    expect((await GET().json()).commit).toBe("unknown");
  });
});
