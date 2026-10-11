import { execFileSync } from "node:child_process";
import { SITE_LAST_MODIFIED, SITE_URL } from "@/lib/constants";

// Static route handler — emitted to out/version.json at build time. Gives
// crawlers, uptime probes, and the `audit:production` script a machine-readable
// deployment fingerprint so a stale edge/agent cache can be told apart from the
// live origin (a page whose commit ≠ HEAD is serving old material).
export const dynamic = "force-static";

/** Best-effort commit SHA: git → Cloudflare Pages env → GitHub Actions env. */
function resolveCommit(): string {
  const candidates: string[] = [];
  try {
    // Fixed argument array, no shell — no injection surface.
    candidates.push(
      execFileSync("git", ["rev-parse", "HEAD"], {
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 2_000,
        maxBuffer: 4_096,
      })
        .toString()
        .trim(),
    );
  } catch {
    // Archives and CI may not include a usable .git directory.
  }
  candidates.push(
    process.env.CF_PAGES_COMMIT_SHA ?? "",
    process.env.GITHUB_SHA ?? "",
  );
  // Never publish arbitrary environment text in the public fingerprint.
  return (
    candidates
      .find((value) => /^(?:[a-f\d]{40}|[a-f\d]{64})$/i.test(value))
      ?.toLowerCase() ?? "unknown"
  );
}

export function GET() {
  const body = {
    commit: resolveCommit(),
    contentRevision: SITE_LAST_MODIFIED,
    builtAt: new Date().toISOString(),
    site: SITE_URL,
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
