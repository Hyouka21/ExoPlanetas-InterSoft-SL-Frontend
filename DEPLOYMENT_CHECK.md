# Deployment Check

This file ensures that all necessary files are present for deployment.

## Required Files Check

- [x] src/api/client.ts
- [x] src/api/types.ts
- [x] src/components/ui/card.tsx
- [x] src/components/ui/badge.tsx
- [x] src/components/ui/button.tsx
- [x] src/components/model/model-metrics-display.tsx
- [x] tsconfig.json
- [x] jsconfig.json
- [x] next.config.js
- [x] package.json
- [x] render.yaml
- [x] .nvmrc

## TypeScript Dependencies

- [x] typescript (moved to dependencies)
- [x] @types/node (moved to dependencies)
- [x] @types/react (in devDependencies)
- [x] @types/react-dom (in devDependencies)

## Build Commands

```bash
npm install
npm run build
npm start
```

## Environment Variables

- NODE_ENV=production
- NEXT_PUBLIC_API_URL=/api

## Node.js Version

- Required: >=18.0.0
- Specified in .nvmrc: 18.18.0
