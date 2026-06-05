// NOTE: CSS import omitted intentionally. This fixture targets issue
// #148 (createContext/RSC server-evaluation bug), which is a JS-bundle
// concern. RDS does export the stylesheet via
// `@fabio.caffarello/react-design-system/styles[.css]`; consumers wire
// it as they would any CSS-side-effect import.
import type { ReactNode } from "react";

export const metadata = {
  title: "RDS Next 16 smoke",
  description:
    "Issue #148 — server-imports RDS without manual `use client` wrapper.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
