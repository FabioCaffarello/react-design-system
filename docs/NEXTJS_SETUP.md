# Next.js setup

Verified against Next 16 (App Router, Turbopack) on RDS 2.x. The same shape works on Next 15.

## Install

```bash
npm install @fabio.caffarello/react-design-system
npm install react@^19 react-dom@^19 lucide-react@^1 react-hook-form@^7
```

`react`, `react-dom`, `lucide-react`, and `react-hook-form` are peer dependencies — Next already ships compatible majors of `react` and `react-dom`, but you do install the other two.

## Stylesheet

Import the bundled stylesheet once, at the top of your root layout. It carries the full token cascade (semantic colors, dark theme, etc.).

```tsx
// app/layout.tsx
import "@fabio.caffarello/react-design-system/styles";
```

No Tailwind setup is required in your project — RDS ships its own CSS and exposes only the semantic classes documented in `.claude/rules/colors.md`.

## Two JS entries

RDS exposes two JS entries that can be used together in the same Server Component:

- **`@fabio.caffarello/react-design-system`** — the default entry. Carries everything (providers, hooks, all primitives, components, layouts, tokens). Its emitted bundle starts with `"use client";`, so importing it from a Server Component (Next App Router) compiles cleanly: Next reads the directive and places the import behind a client boundary. This is the entry to use for `Button`, `Input`, `Dialog`, `Tabs`, `SideNavbar`, `Toast`, `AppProvider`, and every other component that actually has state or hooks.
- **`@fabio.caffarello/react-design-system/server`** — the opt-in server entry (issue #150). Re-exports only the components whose render tree is hook-free and createContext-free: `Text`, `Skeleton`, `Spinner`, `Progress`, `Chip`, `ErrorMessage`, `Info`, `Container`, `Stack`, `Breadcrumb`, `Timeline`, `AutocompleteOption`, `DialogHeader`, `DialogFooter`, `DrawerHeader`, `DrawerFooter`, `HeaderActions`, `HeaderNavigation`, `MenuSeparator`, `NavbarSeparator`, `TableCell`. Its emitted bundle has **no** `"use client"` directive, so importing it from a Server Component does NOT cross a client boundary. The components render on the server; their JS does not ship to the browser. Useful for SEO-critical / first-paint-critical routes where the page shell is presentational.

The two entries can be mixed freely in the same file:

```tsx
// app/profile/page.tsx — a Server Component
import { Button } from "@fabio.caffarello/react-design-system";
import { Text, Container } from "@fabio.caffarello/react-design-system/server";

export default function ProfilePage() {
  return (
    <Container>
      {/* These render on the server and do not ship to the client. */}
      <Text variant="heading" as="h1">
        Profile
      </Text>

      {/* Button has client hooks; Next inserts a boundary automatically. */}
      <Button variant="primary">Edit</Button>
    </Container>
  );
}
```

## Providers in the App Router

If you use any of the global providers (`AppProvider`, `ToastProvider`, `DialogProvider`, `ThemeProvider`, `ConfigProvider`), they live in the main entry and must be mounted at the root. The natural place is the root layout:

```tsx
// app/layout.tsx
import "@fabio.caffarello/react-design-system/styles";
import { AppProvider } from "@fabio.caffarello/react-design-system";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppProvider
          config={{
            theme: { defaultTheme: "light" },
            providers: { theme: true, config: true, toast: true, dialog: true },
          }}
        >
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
```

`AppProvider` itself is a client component (it owns React state for theme and global config), so Next puts the boundary around it automatically. You do not need to add `"use client"` to the layout — the import directive on the main bundle is sufficient.

## Theme override

OS color scheme is followed automatically. To force light or dark, set `data-theme` or the matching class on `<html>`:

```tsx
<html lang="en" data-theme="dark">
  ...
</html>
```

See `README.md` for the full set of override mechanisms.

## What you do NOT need

Earlier RDS versions (pre-1.0 and pre-2.0) required `next.config.js` webpack tweaks — `splitChunks` overrides for the providers, `moduleIds: "deterministic"`, `dynamic({ ssr: false })` workarounds for `AppProvider`, etc. None of that is needed on RDS 2.x:

- The single-bundle main entry (Phase 13d) collapses the cross-chunk `cva` initialization bug structurally — no Next-side `splitChunks` config required.
- The `"use client";` banner at the head of `dist/index.{js,cjs}` (issue #148) makes the bundle compatible with Next 16's RSC compiler — no `dynamic({ ssr: false })` wrapper required.
- The `./server` opt-in entry (issue #150) covers the only scenario where you'd legitimately want to avoid the main bundle's client boundary on a specific page.

If you find yourself reaching for any of those workarounds against RDS 2.x, treat it as a regression report — the public Next 16 smoke fixture under `fixtures/next-smoke/` should reproduce the failure with the same import shape your app uses.

## How the fixture validates this

`fixtures/next-smoke/` is a minimal Next 16 App Router app whose only route is a Server Component that imports from BOTH RDS entries simultaneously. `scripts/next-smoke.mjs` builds RDS, runs `next build` against the fixture, and reads Next's RSC client-reference manifest at `.next/server/app/page_client-reference-manifest.js` to assert:

- the main entry produced a client boundary entry in `clientModules` (issue #148 path exercised), AND
- the `./server` entry produced zero client boundary entries (issue #150 promise verified).

The script runs in CI on every PR that touches RDS source, the Vite configs, the validators, or the fixture itself (path-filtered in `.github/workflows/ci.yml`). If either invariant breaks, the smoke job fails with a precise message naming which entry leaked.

## Versions

RDS 2.x. The Next-specific bugs from RDS 1.x (referenced in older issues — `Cannot access 'aN' before initialization`, `createContext is not a function`) are resolved structurally and gated against regression. RDS 1.x is out of support; upgrade.
