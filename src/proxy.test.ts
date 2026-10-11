import { afterEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "./proxy";

afterEach(() => vi.unstubAllEnvs());

describe("locale proxy redirect boundary", () => {
  it.each([
    "/en//attacker.invalid",
    "/en///attacker.invalid",
    "/en/%2f%2fattacker.invalid",
  ])("keeps %s on the request origin", (path) => {
    vi.stubEnv("NODE_ENV", "production");
    const response = proxy(new NextRequest(`https://portfolio.example${path}`));
    expect(new URL(response.headers.get("location")!).origin).toBe(
      "https://portfolio.example",
    );
  });

  it.each(["/en", "/en/", "/en/about", "/en/projects/project-simurgh"])(
    "preserves the query on the ordinary %s alias",
    (path) => {
      vi.stubEnv("NODE_ENV", "production");
      const response = proxy(
        new NextRequest(`https://portfolio.example${path}?q=one%26two`),
      );
      const destination = new URL(response.headers.get("location")!);
      expect(destination.pathname).toBe(path.slice(3) || "/");
      expect(destination.search).toBe("?q=one%26two");
    },
  );

  it("preserves development passthrough and non-English/static routes", () => {
    vi.stubEnv("NODE_ENV", "development");
    for (const path of ["/en/about", "/fa/about", "/en/feed.xml"])
      expect(
        proxy(new NextRequest(`https://portfolio.example${path}`)).headers.get(
          "location",
        ),
      ).toBeNull();
  });
});
