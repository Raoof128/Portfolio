import js from "@eslint/js";
import globals from "globals";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const vendorPattern = "vendor/braces-guard/**/*.js";

// The attributed dependency is native CommonJS. Keep the web/TypeScript
// configuration unchanged for app files and lint this source with Node rules.
function scopeWebConfig(entry) {
  if (Object.keys(entry).every((key) => ["name", "ignores"].includes(key))) {
    return entry;
  }
  return { ...entry, ignores: [...(entry.ignores ?? []), vendorPattern] };
}

const eslintConfig = defineConfig([
  ...nextVitals.map(scopeWebConfig),
  ...nextTs.map(scopeWebConfig),
  {
    name: "vendor/braces-guard-node-commonjs",
    files: [vendorPattern],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: "latest",
      globals: globals.node,
    },
    rules: {
      ...js.configs.recommended.rules,
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-new-func": "error",
    },
  },
  // Preserve the existing generated-output exclusions.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    ".wrangler/**",
    ".remember/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
