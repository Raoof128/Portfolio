# API and Data Reference

This project is statically rendered and does not expose a runtime HTTP API. The primary "API surface" is the internal typed content model consumed by routes and components.

## 1. Content Model

Defined in `src/lib/data.ts`.

### `Project`

| Field | Type | Description |
| --- | --- | --- |
| `slug` | `string` | Stable URL segment for `/projects/[slug]` |
| `title` | `string` | Display name |
| `category` | `"OFFENSIVE" \| "DEFENSIVE" \| "ENGINEERING"` | Classification |
| `year` | `string` | Publication/reference year |
| `description` | `string` | Card summary |
| `fullDescription` | `string` | Detail-page summary |
| `tags` | `string[]` | Search/filter labels |
| `links` | `demo?`, `repo?`, `caseStudy?` | External/internal links |
| `build` | `stack[]`, `features[]` | Engineering implementation notes |
| `secure` | `measures[]` | Security controls applied |
| `problem` | `string` | Problem statement |
| `solution` | `string[]` | Solution bullets |
| `proof` | `string[]` | Verification evidence |

### `Writeup`

| Field | Type | Description |
| --- | --- | --- |
| `slug` | `string` | URL segment for `/write-ups/[slug]` |
| `title` | `string` | Write-up title |
| `date` | `string` (ISO) | Publication date |
| `tag` | `string` | Topic label |
| `takeaway` | `string` | Short summary |
| `content` | `string` | Markdown-like body |

### `LabExperiment`

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | URL segment for `/lab/[id]` |
| `title` | `string` | Experiment title |
| `status` | `"ACTIVE" \| "ARCHIVED" \| "CONCEPT"` | Lifecycle state |
| `description` | `string` | Summary |
| `tech` | `string[]` | Technologies involved |
| `link` | `string?` | Optional external reference |
| `objective` | `string` | Goal |
| `constraints` | `string` | Safety/operational limits |
| `codeSnippet` | `string` | Rendered snippet |

## 2. Route Contracts

| Route | Source | Static Params |
| --- | --- | --- |
| `/projects/[slug]` | `projects` map | `Object.keys(projects)` |
| `/write-ups/[slug]` | `writeups` array | `writeups.map(slug)` |
| `/lab/[id]` | `labExperiments` array | `labExperiments.map(id)` |

Each dynamic route returns `notFound()` for unknown params and provides metadata derived from its backing data object.

## 3. Metadata Endpoints

| Endpoint | File | Description |
| --- | --- | --- |
| `/sitemap.xml` | `src/app/sitemap.ts` | URL inventory for crawlers |
| `/robots.txt` | `src/app/robots.ts` | Crawler policy |
| `JSON-LD` | `src/app/layout.tsx` | Structured profile metadata |
| `/.well-known/security.txt` | `public/security.txt` | Vulnerability disclosure metadata |

## 4. Stability Notes

- `slug` and `id` fields are stable identifiers and should be treated as immutable once published.
- Any addition to `Project`, `Writeup`, or `LabExperiment` interfaces should include:
  - Type updates
  - Rendering updates where needed
  - Tests validating required fields
