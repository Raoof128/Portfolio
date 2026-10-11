import { describe, expect, it } from "vitest";
import { GET } from "@/app/feed.xml/route";
import { writeups } from "./data";
import { SITE_URL, SITE_LAST_MODIFIED } from "./constants";

describe("static RSS endpoint", () => {
  it("emits well-formed XML with every published article exactly once", async () => {
    const response = GET();
    const xml = new DOMParser().parseFromString(
      await response.text(),
      "application/xml",
    );
    expect(xml.querySelector("parsererror")).toBeNull();
    const items = Array.from(xml.querySelectorAll("item"));
    expect(items).toHaveLength(writeups.length);
    expect(response.headers.get("content-type")).toBe(
      "application/rss+xml; charset=utf-8",
    );
    for (const post of writeups) {
      const item = items.find(
        (node) =>
          node.querySelector("guid")?.textContent ===
          `${SITE_URL}/write-ups/${post.slug}`,
      );
      expect(item).toBeDefined();
      expect(item!.querySelector("title")?.textContent).toBe(post.title);
      expect(item!.querySelector("description")?.textContent).toBe(
        post.takeaway,
      );
      expect(item!.querySelector("pubDate")?.textContent).toBe(
        new Date(post.date).toUTCString(),
      );
    }
    const dates = items.map((node) =>
      Date.parse(node.querySelector("pubDate")!.textContent!),
    );
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
    expect(xml.querySelector("lastBuildDate")?.textContent).toBe(
      new Date(SITE_LAST_MODIFIED).toUTCString(),
    );
  });
});
