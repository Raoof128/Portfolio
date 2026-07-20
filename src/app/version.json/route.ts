import { execFileSync } from "node:child_process";
import { SITE_LAST_MODIFIED } from "@/lib/constants";

// Static route handler — emitted to out/version.json at build time. Gives
// crawlers, uptime probes, and the `audit:production` script a machine-readable
// deployment fingerprint so a stale edge/agent cache can be told apart from the
// live origin (a page whose commit ≠ HEAD is serving old material).
export const dynamic = "force-static";

/** Best-effort commit SHA: git → Cloudflare Pages env → GitHub Actions env. */
function resolveCommit(): string {
  try {
    // Fixed argument array, no shell — no injection surface.
    return execFileSync("git", ["rev-parse", "HEAD"], {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return (
      process.env.CF_PAGES_COMMIT_SHA ?? process.env.GITHUB_SHA ?? "unknown"
    );
  }
}

export function GET() {
  const body = {
    commit: resolveCommit(),
    contentRevision: SITE_LAST_MODIFIED,
    builtAt: new Date().toISOString(),
    site: "https://raoufabedini.dev",
  };
  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
