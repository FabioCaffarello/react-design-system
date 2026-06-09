// Intentionally NO "use client" directive. This page is a React Server
// Component that imports from BOTH RDS entries to exercise both gates
// AND the surface of the `./server` entry in a single render pass:
//
//   1. Issue #148 — the main entry (`.`) carries `"use client"` at the
//      head of its bundle, so importing `Button` (a client primitive)
//      here does NOT crash with `(0, j.createContext) is not a function`
//      during RSC compilation. The bundle's directive turns the
//      Server-Component import into a proper Client-Component boundary
//      at Next's compiler.
//
//   2. Issue #150 — the new `./server` entry has NO `"use client"`,
//      and re-exports only the components audited server-safe by
//      `scripts/lib/server-safe.mjs`. The post-build verification in
//      `scripts/next-smoke.mjs` reads Next's RSC client-reference
//      manifest at `.next/server/app/page_client-reference-manifest.js`
//      and asserts no `dist/server/index.*` key appears in
//      `clientModules` for this route.
//
//   3. Issue #160 — the original fixture only rendered Text and
//      Container, so the smoke never exercised the failure mode that
//      broke the Card: a function-as-prop on a DOM element emitted
//      unconditionally by a `./server` component. Extending the fixture
//      to render the **entire** server-safe surface in one Server
//      Component forces `next build` to fail with "Event handlers cannot
//      be passed to Client Component props" if any component regresses
//      to that shape. The static analyser
//      (`scripts/lib/server-safe.mjs`) cannot catch this class without
//      an AST walker AND a heuristic for pass-through vs always-on
//      handlers that risks false positives — runtime is the
//      authoritative judge. See `.claude/rules/server-entry.md` for the
//      A-vs-B trade-off behind this choice.
//
// When you add a new component to `./server`, render it here with
// MINIMAL static props (no functions, no class instances) so the smoke
// exercises the "consumer instantiates without enabling interactivity"
// path — the exact path that broke the Card.
import { Button } from "@fabio.caffarello/react-design-system";
import {
  Badge,
  Breadcrumb,
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Chip,
  Container,
  DialogFooter,
  DialogHeader,
  DrawerFooter,
  DrawerHeader,
  ErrorMessage,
  HeaderActions,
  HeaderNavigation,
  Info,
  Label,
  MenuSeparator,
  NavbarSeparator,
  PageHeader,
  Progress,
  Separator,
  Skeleton,
  Spinner,
  Stack,
  TableCell,
  Text,
  Timeline,
} from "@fabio.caffarello/react-design-system/server";

export default function Page() {
  return (
    <Container>
      <main>
        <Text variant="heading" as="h1">
          RDS server-entry smoke
        </Text>
        <Button variant="primary">Server-rendered button</Button>

        <Stack>
          <Badge variant="primary">badge</Badge>
          <Chip>chip</Chip>
          <ErrorMessage message="static error" />
          <Info>static info</Info>
          <Label htmlFor="dummy">static label</Label>
          <Progress value={42} />
          <Separator />
          <Skeleton variant="text" />
          <Spinner />
          <Text>body text</Text>
        </Stack>

        <Card>card without onClick — must not emit onKeyDown (issue #160)</Card>

        {/* Card compound (#165) — server-safe across every subcomponent.
            The asSection branch is exercised with an accessible name so
            the dev warn does NOT fire here; landmark-without-name is
            covered by the Card.accessibility.test.tsx suite, not by the
            RSC smoke. */}
        <Card asSection aria-labelledby="card-compound-title">
          <CardHeader>
            <CardTitle id="card-compound-title">compound title</CardTitle>
            <CardSubtitle>compound subtitle</CardSubtitle>
            <CardActions>
              <span>static action node</span>
            </CardActions>
          </CardHeader>
          <CardBody>compound body</CardBody>
        </Card>

        <Breadcrumb
          items={[{ label: "Home", href: "/" }, { label: "Section" }]}
        />

        <DialogHeader>dialog header</DialogHeader>
        <DialogFooter>dialog footer</DialogFooter>
        <DrawerHeader>drawer header</DrawerHeader>
        <DrawerFooter>drawer footer</DrawerFooter>

        <HeaderActions>actions slot</HeaderActions>
        <HeaderNavigation>nav slot</HeaderNavigation>

        <MenuSeparator />
        <NavbarSeparator />

        <PageHeader
          title="static page header"
          description="static description"
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Section" }]}
        />

        <Timeline
          items={[
            { id: "1", title: "step one", status: "completed" },
            { id: "2", title: "step two", status: "active" },
            { id: "3", title: "step three", status: "default" },
          ]}
        />

        <table>
          <tbody>
            <tr>
              <TableCell
                column={{ key: "name", label: "Name" }}
                row={{ name: "Alice" }}
              />
            </tr>
          </tbody>
        </table>
      </main>
    </Container>
  );
}
