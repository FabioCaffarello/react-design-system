// Intentionally NO "use client" directive. This page is a React Server
// Component that imports interactive primitives directly from RDS. If
// the bundle does not carry `"use client"`, Next's RSC compilation
// evaluates RDS in the server runtime, where React.createContext is
// undefined and the build fails with
//   TypeError: (0, j.createContext) is not a function
// (issue #148). Building this page is the smoke gate.
import { Button, Text } from "@fabio.caffarello/react-design-system";

export default function Page() {
  return (
    <main>
      <Text variant="heading" as="h1">
        Hello from a Server Component
      </Text>
      <Button variant="primary">Server-rendered button</Button>
    </main>
  );
}
