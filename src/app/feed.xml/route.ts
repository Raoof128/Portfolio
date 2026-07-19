import { writeups } from "@/lib/data";
import { SITE_URL, SITE_LAST_MODIFIED } from "@/lib/constants";

export const dynamic = "force-static";

const AUTHOR = "Mohammad Raouf Abedini";

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET(): Response {
  // Most-recent first; dates are fixed content dates so output is deterministic.
  const posts = [...writeups].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const items = posts
    .map((p) => {
      const url = `${SITE_URL}/write-ups/${p.slug}`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <category>${esc(p.tag)}</category>
      <dc:creator>${esc(AUTHOR)}</dc:creator>
      <description>${esc(p.takeaway)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Mohammad Raouf Abedini — Write-ups</title>
    <link>${SITE_URL}/write-ups</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Technical write-ups on AI security research, LLM agent red-teaming, and verifiable containment.</description>
    <language>en</language>
    <managingEditor>raoof.r12@gmail.com (${esc(AUTHOR)})</managingEditor>
    <lastBuildDate>${new Date(SITE_LAST_MODIFIED).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
