# TRUSTY.bot

Intent authorization for AI agent purchases: verify that the proposed purchase matches the human instruction before it proceeds.

## Current implementation

The public website explains the new concept and offers an interactive, local purchase demo. It illustrates how a purchase can stay within budget while changing the authorized quantity, specification or delivery. The demo can download an example JSON decision record; it does not submit payments.

The existing agent discovery, crawler, repository scanner, ranking, scoring and legacy decision simulator remain in the application. Public exploration and existing authentication remain available; this is not yet a secure multi-tenant mandate authorization service.

Brex, Ramp and Slash connectors, durable mandates, approval enforcement and financial outcome reconciliation are planned. Platform names do not imply announced partnerships. See the [implementation plan](specs/06_AUTHORIZATION_LAYER_IMPLEMENTATION_PLAN.md) for the intended backend and pilot work.

## Routes

- `/` — commercial website.
- `/demo` — illustrative intent checks and example decision download.
- `/contact` — demo/pilot contact via `paulo@trusty.bot` (opens an email client).
- `/docs` — integration approach and availability.
- `/app` — existing agent workspace; `/app?signin=1` opens its sign-in interface.

## Local development

Use Node.js compatible with Next.js 14 and npm.

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). The public website and local intent demo need no financial provider credentials. Configure existing workspace services separately; `.env.example` describes Firebase variables, while the source also contains Supabase integration. Do not treat local storage or filesystem fallback as durable production storage.

```sh
npm run build
npm run start
```

`npm run lint` invokes the repository's Next.js lint command; lint tooling may require setup. Framework: Next.js 14 App Router, React 18, TypeScript and Tailwind CSS.

## Source organization

- `src/app/(marketing)` and `src/components/marketing`: commercial pages and interactive examples.
- `src/app/(workspace)/app`: existing workspace.
- `src/app/api` and `src/lib`: existing APIs, discovery, scanning, scoring and persistence code.
- [PRODUCT.md](PRODUCT.md): product scope and implementation boundaries.
- [DESIGN.md](DESIGN.md): marketing design system and workspace distinction.
- `specs`: architecture and implementation plans; specifications can describe future work and are not evidence of shipped capabilities.
