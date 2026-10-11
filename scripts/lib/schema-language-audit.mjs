/** Validate body language separately from original DOI publication language. */
export function auditSchemaLanguages(html, { locale, pageUrl, kind }) {
  const errors = [];
  const nodes = [];
  const blocks = html.matchAll(
    /<script\b[^>]*\btype\s*=\s*(["'])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi,
  );
  const flatten = (value) => {
    if (Array.isArray(value)) return value.flatMap(flatten);
    if (!value || typeof value !== "object") return [];
    return [
      value,
      ...(Array.isArray(value["@graph"])
        ? value["@graph"].flatMap(flatten)
        : []),
    ];
  };
  for (const [, , block] of blocks) {
    try {
      nodes.push(...flatten(JSON.parse(block)));
    } catch {
      errors.push("JSON-LD fails to parse");
    }
  }
  const types = (node) =>
    Array.isArray(node["@type"]) ? node["@type"] : [node["@type"]];
  const bodyTypes =
    kind === "project"
      ? ["SoftwareSourceCode", "CreativeWork"]
      : ["TechArticle", "BlogPosting", "ScholarlyArticle"];
  const bodies = nodes.filter(
    (node) =>
      bodyTypes.some((type) => types(node).includes(type)) &&
      (node.url === pageUrl ||
        String(node["@id"] ?? "").startsWith(`${pageUrl}#`)),
  );
  if (!bodies.length) errors.push(`missing primary ${kind} schema`);
  for (const body of bodies) {
    if (body.inLanguage !== locale)
      errors.push(
        `primary ${kind} inLanguage=${body.inLanguage ?? "missing"}, expected ${locale}`,
      );
  }
  for (const node of nodes) {
    if (
      types(node).includes("ScholarlyArticle") &&
      /^https:\/\/doi\.org\//.test(String(node["@id"] ?? "")) &&
      node.inLanguage !== "en"
    )
      errors.push(
        `original DOI paper inLanguage=${node.inLanguage ?? "missing"}, expected en`,
      );
  }
  return errors;
}
