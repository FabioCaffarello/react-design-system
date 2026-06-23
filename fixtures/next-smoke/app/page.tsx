// Intentionally NO "use client" directive. This page is a React Server
// Component that imports from BOTH RDS entries to exercise both gates
// AND the surface of the `./server` entry in a single render pass:
//
//   1. Issue #148 — the main entry (`.`) carries `"use client"` at the
//      head of its bundle, so importing a client primitive here (now
//      `Input` — `Button` moved to `./server` in #224) does NOT crash
//      with `(0, j.createContext) is not a function` during RSC
//      compilation. The bundle's directive turns the Server-Component
//      import into a proper Client-Component boundary at Next's compiler.
//      `Input` is the probe because it genuinely stays client (useState
//      password toggle, useId, useCallback) — see #224's deferred half.
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
import { Input } from "@fabio.caffarello/react-design-system";
import {
  AvatarBase,
  Badge,
  Breadcrumb,
  EmptyStateBase,
  Button,
  Card,
  CardActions,
  CardBody,
  CardHeader,
  CardSubtitle,
  CardTitle,
  Chip,
  Container,
  DataBadge,
  DialogFooter,
  DialogHeader,
  DrawerFooter,
  DrawerHeader,
  ErrorMessage,
  FilterChips,
  HeaderActions,
  HeaderNavigation,
  HeroSection,
  Info,
  InputBase,
  Label,
  MenuSeparator,
  NavbarSeparator,
  PageHeader,
  Progress,
  Separator,
  Skeleton,
  Spinner,
  Stack,
  Stat,
  StatGroup,
  TableCell,
  TabsAsLinks,
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
        {/* Button (#224) — now server-safe. Exercise the consumer's
            server forms: a plain styled button, the asChild link form,
            and a submit button. None pass an onClick, so no function prop
            is emitted on the DOM element (axis 2). */}
        <Button variant="primary">Server-rendered button</Button>
        <Button asChild variant="link">
          <a href="/server-link">server asChild link</a>
        </Button>
        <Button type="submit">submit</Button>

        {/* Issue #148 client-boundary probe — Input genuinely stays
            client (#224's deferred half); importing it from the main
            entry keeps dist/index.* in the RSC clientModules manifest. */}
        <Input aria-label="client-boundary probe" />

        {/* InputBase (#224) — server-safe presentational input. Static
            props only (id for label association, name for native submit);
            no client state. The enclosing native GET form is exactly the
            zero-client-state use case the server entry unblocks. */}
        <form method="get" action="/search">
          <InputBase id="q" name="q" label="Search" placeholder="Buscar…" />
        </form>

        {/* AvatarBase (#250) — server-safe avatar shell. The two paths
            exercised: initials (src absent — fallback rendered on server)
            and <img> (src present — no onError handler, static render).
            Neither path emits a function prop on a DOM element (axis 2). */}
        <AvatarBase fallback="JP" alt="Server-rendered initials" size="md" />
        <AvatarBase
          src="https://i.pravatar.cc/150?img=3"
          alt="Server-rendered image"
          size="md"
          loading="lazy"
        />

        <Stack>
          <Badge variant="primary">badge</Badge>
          <Chip>chip</Chip>
          <DataBadge label="L2" source="Portal Transparência" tone="warning" />
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

        {/* FilterChips (#162) — server-safe chip-group shell. Static props
            only: the string label doubles as the group's aria-label, and
            the chips are the zero-JS asChild form (anchor children, no
            handlers) plus a plain static Chip. */}
        <FilterChips label="Filtros">
          <Chip asChild>
            <a href="?uf=SP">UF: SP</a>
          </Chip>
          <Chip>Partido: PT</Chip>
        </FilterChips>
        <FilterChips label="Período" wrap={false}>
          <Chip>2025</Chip>
          <Chip>2026</Chip>
        </FilterChips>

        {/* Stat compound (#166) — server-safe. The empty-state branch
            (value={null}) exercises the em-dash + aria-label path inside
            an RSC build; static props only, no functions. */}
        <StatGroup layout="grid" cols={4}>
          <Stat value="9,4 mil" label="Parlamentares" align="center" />
          <Stat value="3,2 mil" label="Proposições" align="center" />
          <Stat value={0} label="Votações" hint="legítimo: 0" />
          <Stat
            value={null}
            label="Alinhamento"
            hint="empty: aria-label No data"
          />
        </StatGroup>

        <PageHeader
          title="static page header"
          description="static description"
          breadcrumb={[{ label: "Home", href: "/" }, { label: "Section" }]}
        />

        {/* HeroSection (#163) — server-safe top-of-page hero. Static string
            props only (no functions): the string title doubles as the
            <section> landmark name, and the gradient-glow variant exercises
            the decorated-surface path inside an RSC build. */}
        <HeroSection
          variant="gradient-glow"
          kicker="static kicker"
          title="static hero"
          description="static description"
          meta="static meta"
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

        {/* EmptyStateBase (#252 follow-up) — server-safe empty-state shell.
            The two paths exercised: title-only (no message, no action) and
            the full composition (title + message + zero-JS link action).
            Neither path emits a function prop on a DOM element (axis 2). */}
        <EmptyStateBase title="Sem resultados" />
        <EmptyStateBase
          title="Nenhuma proposição"
          message="Tente outros filtros."
          action={<a href="/?reset">Limpar filtros</a>}
        />

        {/* TabsAsLinks (#210) — server-safe URL-nav tabs. Static items only
            (string labels + hrefs, a caller-supplied active boolean); the
            default <a> rendering keeps the render zero-JS, and the named
            <nav> + aria-current path runs inside the RSC build. */}
        <TabsAsLinks
          aria-label="Smoke tabs"
          items={[
            { label: "Overview", href: "?tab=overview", active: true },
            { label: "Alerts", href: "?tab=alerts", count: 3 },
            { label: "Settings", href: "?tab=settings" },
          ]}
        />
      </main>
    </Container>
  );
}
