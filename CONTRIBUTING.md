# Contributing

## Release checklist

Before every release:

1. Upgrade all @tanstack/* to latest before every release.
2. Run `npm audit --audit-level=high`, `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`.
3. Do not move tags `v1.7.5`, `v1.6.2.1`, or `v1.8.0`.
