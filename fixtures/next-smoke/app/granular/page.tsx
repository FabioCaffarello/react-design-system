"use client";
// Issue #208 — the granularity gate, measurement side A.
//
// This client page imports ONE client component from the `./granular`
// entry (preserveModules tree). Its twin at app/barrel-control/page.tsx
// imports the SAME component from the main entry (`.`, single bundle).
// scripts/next-smoke.mjs step 5 compares the JS chunks exclusive to
// each route (from the prerendered HTML) and asserts this route's
// payload is a fraction of the control's — i.e. importing one
// component from `./granular` does NOT pull the whole barrel, the
// consumer-measured failure that reverted the Accordion adoption
// (+264KB on a Next 16 route).
import { Accordion } from "@fabio.caffarello/react-design-system/granular";

export default function GranularPage() {
  return (
    <main>
      <h1>granular import</h1>
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
