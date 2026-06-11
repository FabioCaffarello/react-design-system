"use client";
// Issue #208 — the granularity gate, measurement side B (control).
//
// Identical render to app/granular/page.tsx, but importing Accordion
// from the MAIN entry — the single pre-bundled "use client" file that
// is opaque to tree-shaking by design. This route's client JS size is
// the denominator of the granularity assertion in
// scripts/next-smoke.mjs step 5: the granular route must come out a
// fraction of this one. Self-calibrating — no absolute byte thresholds
// to go stale as the library grows.
import { Accordion } from "@fabio.caffarello/react-design-system";

export default function BarrelControlPage() {
  return (
    <main>
      <h1>barrel import (control)</h1>
      <Accordion
        type="single"
        items={[
          { id: "a", title: "Section A", content: "Content A" },
          { id: "b", title: "Section B", content: "Content B" },
        ]}
      />
    </main>
  );
}
