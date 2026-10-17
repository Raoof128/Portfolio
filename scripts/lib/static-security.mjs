import { lstat, readdir, readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import {
  auditSecurityHeaders,
  auditSecurityExpiry,
} from "./production-audit.mjs";

const extensions = new Set([
  ".html",
  ".txt",
  ".xml",
  ".json",
  ".js",
  ".css",
  ".woff",
  ".woff2",
  ".pdf",
  ".ico",
  ".svg",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".avif",
  ".gif",
  ".mp4",
  ".webm",
]);
const required = [
  "_headers",
  "_redirects",
  "en.html",
  "404.html",
  "security.txt",
  ".well-known/security.txt",
  "version.json",
  "robots.txt",
  "sitemap.xml",
  "feed.xml",
  "llms.txt",
  "llms-full.txt",
];

// Explicit authored assets prevent a broad extension check from publishing
// source directories or enabling Pages advanced-mode execution controls.
const publicAssets = new Set([
  ...required,
  "_not-found.html",
  "_not-found.txt",
  "favicon.ico",
  "Banking_Shield_Machine_Checked_Absence_Claims_Preprint_v1.2.pdf",
  "Invisible_Window_Research_Preprint_V2.0.pdf",
  "Mohammad_Raouf_Abedini_Resume.pdf",
  "Project_Simurgh_Preprint_v1.0.pdf",
  "Project_Simurgh_Voting_Adjacent_Supplement_Phase_C_Preprint_v1.0.pdf",
  "aion-bibleqa-citation-faithfulness-bible-rag.pdf",
  "Raouf_2.jpg",
  "Raouf_2.png",
  "og.png",
  "brand/favicon.svg",
  "brand/glass-lens-map.png",
  "brand/raouf-mark.svg",
  "file.svg",
  "globe.svg",
  "next.svg",
  "vercel.svg",
  "window.svg",
  "images/raouf-welcome-168-2ae922a8.webp",
  "images/raouf-about-600-7d22ea07.webp",
]);

function approvedPublicPath(name) {
  if (publicAssets.has(name)) return true;
  if (/^(en|fa|ar|zh|es)(\/[a-z0-9-]+)*\.(html|txt)$/.test(name)) return true;
  if (
    /^(en|fa|ar|zh|es|_not-found)(\/[a-z0-9-]+)*\/__next\.[a-zA-Z0-9_$.-]+\.txt$/.test(
      name,
    )
  )
    return true;
  if (
    /^_next\/[a-zA-Z0-9_-]{1,64}\/(?:_buildManifest|_ssgManifest)\.js$/.test(
      name,
    )
  )
    return true;
  return /^_next\/static\/[a-zA-Z0-9_.$/-]+\.(js|css|woff2?|ico|png|jpg|jpeg|webp|avif|svg)$/.test(
    name,
  );
}

function approvedDirectory(name) {
  return (
    name === ".well-known" ||
    name === "brand" ||
    name === "images" ||
    /^(en|fa|ar|zh|es|_not-found)(\/[a-z0-9-]+)*$/.test(name) ||
    name === "_next" ||
    /^_next\/[a-zA-Z0-9_-]{1,64}$/.test(name) ||
    /^_next\/static(?:\/[a-zA-Z0-9_.$-]+)*$/.test(name)
  );
}

function disclosureSignature(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const separator = line.indexOf(":");
      return `${line.slice(0, separator).trim().toLowerCase()}: ${line.slice(separator + 1).trim()}`;
    })
    .sort()
    .join("\n");
}

function auditDisclosure(text) {
  const issues = [];
  const fields = new Map();
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const separator = line.indexOf(":");
    if (separator < 1) {
      issues.push("invalid disclosure field");
      continue;
    }
    const name = line.slice(0, separator).trim().toLowerCase();
    const values = fields.get(name) ?? [];
    values.push(line.slice(separator + 1).trim());
    fields.set(name, values);
  }
  for (const [name, expected] of [
    ["contact", "mailto:raoof.r999@outlook.com"],
    ["canonical", "https://raoufabedini.dev/.well-known/security.txt"],
  ]) {
    const values = fields.get(name);
    if (values?.length !== 1 || values[0] !== expected)
      issues.push(`missing or unapproved disclosure ${name}`);
  }
  const expires = fields.get("expires");
  const expiry =
    expires?.length === 1
      ? auditSecurityExpiry(expires[0])
      : "missing or duplicate Expires";
  if (expiry) issues.push(`disclosure ${expiry}`);
  return issues;
}

export function parseGlobalSecurityHeaders(text) {
  const headers = new Headers();
  let global = false;
  const protectedHeaders = new Set([
    "content-security-policy",
    "strict-transport-security",
    "x-frame-options",
    "x-content-type-options",
    "referrer-policy",
    "permissions-policy",
    "cross-origin-opener-policy",
  ]);
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (!/^\s/.test(line)) {
      global = line.trim() === "/*";
      continue;
    }
    const separator = line.indexOf(":");
    const declaration = line.trim();
    const name = declaration.startsWith("!")
      ? declaration.slice(1).trim().toLowerCase()
      : line.slice(0, separator).trim().toLowerCase();
    // Pages permits specific rules to detach a header from a global rule.
    // Keep every security declaration global so sampling cannot miss a gap.
    if (!global && protectedHeaders.has(name))
      throw new Error(`specific rule overrides protected header ${name}`);
    if (!global) continue;
    if (separator < 1) throw new Error("invalid global header declaration");
    // Append preserves duplicate declarations, as the host combines them.
    headers.append(
      line.slice(0, separator).trim(),
      line.slice(separator + 1).trim(),
    );
  }
  return headers;
}

export function auditRedirectRules(text) {
  const issues = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const [source, destination, status = "302", extra] = line
      .trim()
      .split(/\s+/);
    if (
      !destination ||
      extra ||
      !["200", "301", "302", "303", "307", "308"].includes(status)
    ) {
      issues.push("invalid static redirect declaration");
      continue;
    }
    if (
      !destination.startsWith("/") ||
      destination.startsWith("//") ||
      destination.includes("\\") ||
      /[\u0000-\u0020\u007f]/.test(destination)
    )
      issues.push(`${source}: redirect destination must remain a local path`);
    const placeholder = /:[a-z]\w*/i.exec(destination);
    if (status !== "200" && placeholder) {
      const prefix = destination.slice(0, placeholder.index);
      if (!/^\/[a-z0-9][a-z0-9._-]*\//i.test(prefix))
        issues.push(`${source}: redirect splat has no fixed section prefix`);
    }
  }
  return issues;
}

export async function auditStaticArtifact(directory) {
  const issues = [];
  const files = [];
  let entries = 0;
  try {
    const root = await lstat(directory);
    if (!root.isDirectory() || root.isSymbolicLink())
      throw new Error("artifact root must be a real directory");
    async function visit(relative = "", depth = 0) {
      if (depth > 16 || files.length >= 10_000)
        throw new Error("artifact inventory limit exceeded");
      for (const entry of await readdir(join(directory, relative), {
        withFileTypes: true,
      })) {
        if (++entries > 10_000)
          throw new Error("artifact inventory limit exceeded");
        const name = relative ? `${relative}/${entry.name}` : entry.name;
        if (
          entry.isSymbolicLink() ||
          (!entry.isDirectory() && !entry.isFile())
        ) {
          issues.push(`${name}: nonregular artifact entry`);
          continue;
        }
        if (
          /[\\\u0000-\u001f\u007f]/.test(name) ||
          name
            .split("/")
            .some(
              (part, index) =>
                part.startsWith(".") &&
                !(index === 0 && part === ".well-known"),
            )
        ) {
          issues.push(`${name}: unexpected hidden or unsafe artifact path`);
          continue;
        }
        if (entry.isDirectory()) {
          if (name.startsWith(".well-known/")) {
            issues.push(`${name}: unapproved disclosure-directory entry`);
            continue;
          }
          if (!approvedDirectory(name)) {
            issues.push(`${name}: unapproved public directory`);
            continue;
          }
          await visit(name, depth + 1);
          continue;
        }
        files.push(name);
        if (files.length > 10_000)
          throw new Error("artifact inventory limit exceeded");
        if (
          name.startsWith(".well-known/") &&
          name !== ".well-known/security.txt"
        )
          issues.push(`${name}: unapproved disclosure-directory file`);
        if (
          !extensions.has(extname(name).toLowerCase()) &&
          !["_headers", "_redirects"].includes(name)
        )
          issues.push(`${name}: unapproved public file type`);
        if (!approvedPublicPath(name))
          issues.push(`${name}: unapproved public path`);
      }
    }
    await visit();
    for (const name of required)
      if (!files.includes(name))
        issues.push(`${name}: required artifact file missing`);
    if (files.includes("_headers")) {
      const text = await readFile(join(directory, "_headers"), "utf8");
      if (text.split(/\r?\n/).some((line) => line.length > 2_000))
        issues.push("_headers: host line limit exceeded");
      issues.push(...auditSecurityHeaders(parseGlobalSecurityHeaders(text)));
    }
    if (files.includes("_redirects"))
      issues.push(
        ...auditRedirectRules(
          await readFile(join(directory, "_redirects"), "utf8"),
        ),
      );
    if (
      files.includes("security.txt") &&
      files.includes(".well-known/security.txt")
    ) {
      const rootContact = await readFile(join(directory, "security.txt"));
      const canonicalContact = await readFile(
        join(directory, ".well-known/security.txt"),
      );
      // Courtesy and canonical files can have different explanatory comments.
      // Compare their fields, and validate both copies independently.
      const rootText = rootContact.toString("utf8");
      const canonicalText = canonicalContact.toString("utf8");
      if (disclosureSignature(rootText) !== disclosureSignature(canonicalText))
        issues.push("disclosure contact copies differ");
      issues.push(
        ...auditDisclosure(rootText),
        ...auditDisclosure(canonicalText),
      );
    }
  } catch (error) {
    issues.push(
      `artifact validation failed: ${error instanceof Error ? error.message : "unknown I/O error"}`,
    );
  }
  return { issues, files: files.sort() };
}
