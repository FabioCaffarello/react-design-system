// Intentionally NO "use client" directive. This page is a React Server
// Component that imports from BOTH RDS entries to exercise both gates:
//
//   1. Issue #148 — the main entry (`.`) carries `"use client"` at the
//      head of its bundle, so importing `Button` (a client primitive)
//      here does NOT crash with `(0, j.createContext) is not a function`
//      during RSC compilation. The bundle's directive turns the
//      Server-Component import into a proper Client-Component
//      boundary at Next's compiler.
//
//   2. Issue #150 — the new `./server` entry has NO `"use client"`,
//      and re-exports only the components audited server-safe by
//      `scripts/lib/server-safe.mjs`. `Text` (presentational, no
//      hooks, no createContext) renders ON THE SERVER without
//      crossing a client boundary. The post-build verification in
//      `scripts/next-smoke.mjs` greps the produced .next chunks to
//      assert this property empirically: `Text`'s own emitted
//      identifier from `./server` must not appear in any client chunk
//      that does not also need `Button`.
import { Button } from "@fabio.caffarello/react-design-system";
import { Text, Container } from "@fabio.caffarello/react-design-system/server";

export default function Page() {
  return (
    <Container>
      <main>
        <Text variant="heading" as="h1">
          Hello from a Server Component
        </Text>
        <Button variant="primary">Server-rendered button</Button>
      </main>
    </Container>
  );
}
