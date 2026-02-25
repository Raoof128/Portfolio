# Contributing Guide

Thanks for contributing to this portfolio project.

## Development Setup

```bash
git clone https://github.com/Raoof128/Portfolio.git
cd Portfolio
npm ci
npm run dev
```

## Branch and PR Workflow

1. Create a feature/fix branch from `main`.
2. Keep changes focused and cohesive.
3. Add or update tests for behavior changes.
4. Open a PR with:
   - Problem statement
   - Summary of changes
   - Verification steps/results

## Quality Requirements

All pull requests must pass:

```bash
npm run lint
npm run typecheck
npm run test:ci
npm run build
```

## Coding Standards

- TypeScript with strict typing.
- Reuse `src/lib/constants.ts` for canonical URLs and contact metadata.
- Keep components composable and route logic thin.
- Preserve accessibility semantics (`aria-*`, labels, focus states).
- Avoid introducing hard-coded secrets or credentials.

## Documentation Requirements

If you change behavior or structure, update relevant docs:

- `README.md`
- `docs/ARCHITECTURE.md`
- `docs/API_REFERENCE.md`
- `CHANGELOG.md`

## Security Reporting

Do not open public issues for vulnerabilities. Use the private reporting process in [SECURITY.md](./SECURITY.md).

## License

By contributing, you agree that your contributions are licensed under the [MIT License](./LICENSE).
