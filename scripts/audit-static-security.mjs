#!/usr/bin/env node
import { resolve } from "node:path";
import { auditStaticArtifact } from "./lib/static-security.mjs";

const { issues, files } = await auditStaticArtifact(
  resolve(process.argv[2] ?? "out"),
);
if (issues.length) {
  console.error(`Static security audit failed (${issues.length} issues):`);
  for (const issue of issues) console.error(`  ${issue}`);
  process.exitCode = 1;
} else
  console.log(
    `Static security audit passed (${files.length} files; disclosure contact, browser policy and routing preserved).`,
  );
