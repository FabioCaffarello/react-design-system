# Plano: Arquitetura de Subcomponentes do SideNavbar

## Objetivo
Evoluir o SideNavbar para uma arquitetura com subcomponentes que possuem seus próprios contextos hierárquicos:
1. **Navbar** como subcomponente com NavbarContext próprio
2. **Sidebar** como subcomponente com SidebarContext próprio (agrupa Header, Content, Footer)
3. Hierarquia de contextos com herança do pai
4. Melhor posicionamento do toggle
5. Stories mais completas

---

## Nova Arquitetura Hierárquica

### Estrutura de Subcomponentes

```
SideNavbar (Root - fornece contexto base)
│
├── SideNavbar.Navbar (tem NavbarContext - herda de Root)
│   ├── Navegação de ícones
│   └── SideNavbar.Navbar.Toggle (posição dentro do navbar)
│
├── SideNavbar.Sidebar (tem SidebarContext - herda de Root)
│   ├── SideNavbar.Sidebar.Header
│   ├── SideNavbar.Sidebar.Content
│   │   └── SideNavbar.Sidebar.Group
│   └── SideNavbar.Sidebar.Footer
│
├── SideNavbar.Toggle (posição flutuante/externa)
├── SideNavbar.ResizeHandle
└── SideNavbar.Backdrop
```

### Hierarquia de Contextos

```
SideNavbarRootContext (Base - Theme, Config, State)
├── NavbarContext (Navbar-specific state)
│   └── navbarRef, isNavbarHovered, activeItem, etc.
│
└── SidebarContext (Sidebar-specific state)
    └── sidebarRef, scrollPosition, activeGroup, etc.
```

---

## Design dos Contextos

### 1. SideNavbarRootContext (Já Existe - 3 Camadas)

O sistema atual de 3 camadas (Theme, Config, State) permanece como a base:

```typescript
// Hierarquia existente
SideNavbarThemeContext   → Visual (variant, widths, animations)
SideNavbarConfigContext  → Behavioral (mode, resizable, responsive)
SideNavbarStateContext   → Runtime (collapsed, width, mobile, groups)
```

### 2. NavbarContext (NOVO)

```typescript
interface NavbarContextValue {
  // Herdados do Root (via hook)
  collapsed: boolean;
  toggle: () => void;

  // Específicos do Navbar
  navbarRef: React.RefObject<HTMLElement>;
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
  isHovered: boolean;

  // Toggle interno
  showInternalToggle: boolean;
  togglePosition: 'top' | 'bottom';
}
```

### 3. SidebarContext (NOVO)

```typescript
interface SidebarContextValue {
  // Herdados do Root (via hook)
  collapsed: boolean;
  currentWidth: number;
  isMobile: boolean;

  // Específicos do Sidebar
  sidebarRef: React.RefObject<HTMLElement>;
  scrollPosition: number;
  setScrollPosition: (pos: number) => void;

  // Header/Footer
  hasHeader: boolean;
  hasFooter: boolean;
  registerHeader: () => void;
  registerFooter: () => void;

  // Groups
  activeGroup: string | null;
  setActiveGroup: (id: string | null) => void;
}
```

---

## Implementação dos Subcomponentes

### 1. SideNavbar.Navbar

```tsx
// components/Navbar/Navbar.tsx
interface NavbarProps {
  children: ReactNode;
  showToggle?: boolean;
  togglePosition?: 'top' | 'bottom';
  className?: string;
}

function Navbar({ children, showToggle, togglePosition = 'bottom', ...props }: NavbarProps) {
  const rootState = useSideNavbarStateRequired();
  const navbarRef = useRef<HTMLElement>(null);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const contextValue: NavbarContextValue = useMemo(() => ({
    // Do Root
    collapsed: rootState.collapsed,
    toggle: rootState.toggle,
    // Próprios
    navbarRef,
    activeItem,
    setActiveItem,
    isHovered,
    showInternalToggle: showToggle ?? false,
    togglePosition,
  }), [rootState.collapsed, rootState.toggle, activeItem, isHovered, showToggle, togglePosition]);

  return (
    <NavbarContext.Provider value={contextValue}>
      <nav
        ref={navbarRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...props}
      >
        {children}
        {showToggle && <NavbarToggle position={togglePosition} />}
      </nav>
    </NavbarContext.Provider>
  );
}

// Compound pattern
Navbar.Toggle = NavbarToggle;
Navbar.Item = NavbarItem;
Navbar.Separator = NavbarSeparator;
```

### 2. SideNavbar.Sidebar

```tsx
// components/Sidebar/Sidebar.tsx
interface SidebarProps {
  children: ReactNode;
  className?: string;
}

function Sidebar({ children, ...props }: SidebarProps) {
  const rootState = useSideNavbarStateRequired();
  const rootTheme = useSideNavbarThemeRequired();
  const sidebarRef = useRef<HTMLElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [hasHeader, setHasHeader] = useState(false);
  const [hasFooter, setHasFooter] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);

  const contextValue: SidebarContextValue = useMemo(() => ({
    // Do Root
    collapsed: rootState.collapsed,
    currentWidth: rootState.currentWidth,
    isMobile: rootState.isMobile,
    // Próprios
    sidebarRef,
    scrollPosition,
    setScrollPosition,
    hasHeader,
    hasFooter,
    registerHeader: () => setHasHeader(true),
    registerFooter: () => setHasFooter(true),
    activeGroup,
    setActiveGroup,
  }), [rootState.collapsed, rootState.currentWidth, rootState.isMobile,
      scrollPosition, hasHeader, hasFooter, activeGroup]);

  return (
    <SidebarContext.Provider value={contextValue}>
      <aside
        ref={sidebarRef}
        style={{
          opacity: rootState.collapsed ? 0 : 1,
          visibility: rootState.collapsed ? 'hidden' : 'visible',
          width: `calc(${rootTheme.contentWidth} - ${rootTheme.navigationWidth})`,
          transitionDuration: `${rootTheme.animationDuration}ms`,
        }}
        {...props}
      >
        {children}
      </aside>
    </SidebarContext.Provider>
  );
}

// Compound pattern
Sidebar.Header = SidebarHeader;
Sidebar.Content = SidebarContent;
Sidebar.Footer = SidebarFooter;
Sidebar.Group = SidebarGroup;
```

### 3. Componentes Filhos do Sidebar

```tsx
// components/Sidebar/SidebarHeader.tsx
function SidebarHeader({ children, title, subtitle, ...props }: SidebarHeaderProps) {
  const { registerHeader, collapsed } = useSidebarRequired();

  useEffect(() => {
    registerHeader();
  }, [registerHeader]);

  if (collapsed) return null;

  return (
    <header {...props}>
      {children || (
        <>
          {title && <h2>{title}</h2>}
          {subtitle && <p>{subtitle}</p>}
        </>
      )}
    </header>
  );
}

// components/Sidebar/SidebarContent.tsx
function SidebarContent({ children, scrollable = true, padding = 'md', ...props }: SidebarContentProps) {
  const { collapsed, setScrollPosition } = useSidebarRequired();

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollPosition(e.currentTarget.scrollTop);
  };

  if (collapsed) return null;

  return (
    <div onScroll={scrollable ? handleScroll : undefined} {...props}>
      {children}
    </div>
  );
}

// components/Sidebar/SidebarGroup.tsx
function SidebarGroup({ id, title, children, collapsible = true, ...props }: SidebarGroupProps) {
  const { activeGroup, setActiveGroup } = useSidebarRequired();
  const { groupStates, toggleGroup } = useSideNavbarStateRequired();

  const isOpen = !groupStates[id];

  return (
    <Collapsible open={isOpen} onOpenChange={() => toggleGroup(id)}>
      {title && (
        <Collapsible.Trigger onClick={() => setActiveGroup(id)}>
          {title}
        </Collapsible.Trigger>
      )}
      <Collapsible.Content>
        {children}
      </Collapsible.Content>
    </Collapsible>
  );
}
```

---

## Nova Estrutura de Arquivos

```
src/ui/organisms/SideNavbar/
├── SideNavbar.tsx                    # Main compound component
├── index.ts                          # Public exports
│
├── types/
│   └── index.ts                      # All type definitions
│
├── contexts/
│   ├── index.ts
│   ├── SideNavbarThemeContext.tsx    # (existente)
│   ├── SideNavbarConfigContext.tsx   # (existente)
│   ├── SideNavbarStateContext.tsx    # (existente)
│   ├── NavbarContext.tsx             # NOVO - Navbar specific
│   └── SidebarContext.tsx            # NOVO - Sidebar specific
│
├── providers/
│   ├── index.ts
│   ├── SideNavbarProvider.tsx        # (existente)
│   ├── SideNavbarThemeProvider.tsx   # (existente)
│   ├── SideNavbarConfigProvider.tsx  # (existente)
│   └── SideNavbarStateProvider.tsx   # (existente)
│
├── components/
│   ├── index.ts
│   ├── SideNavbarRoot.tsx            # (existente)
│   │
│   ├── Navbar/                       # NOVO - Subcomponente Navbar
│   │   ├── index.ts
│   │   ├── Navbar.tsx                # Provider + Container
│   │   ├── NavbarToggle.tsx          # Toggle interno
│   │   ├── NavbarItem.tsx            # Item de navegação
│   │   └── NavbarSeparator.tsx       # Separador
│   │
│   ├── Sidebar/                      # NOVO - Subcomponente Sidebar
│   │   ├── index.ts
│   │   ├── Sidebar.tsx               # Provider + Container
│   │   ├── SidebarHeader.tsx         # Header
│   │   ├── SidebarContent.tsx        # Content scrollable
│   │   ├── SidebarFooter.tsx         # Footer
│   │   └── SidebarGroup.tsx          # Group colapsável
│   │
│   ├── SideNavbarToggle.tsx          # Toggle flutuante (existente, melhorado)
│   ├── SideNavbarResizeHandle.tsx    # (existente)
│   └── SideNavbarBackdrop.tsx        # (existente)
│
├── hooks/
│   ├── index.ts
│   ├── useNavbar.ts                  # NOVO - Hook do Navbar
│   ├── useSidebar.ts                 # NOVO - Hook do Sidebar
│   └── ... (hooks existentes)
│
└── stories/
    ├── SideNavbar.stories.tsx        # Stories atualizadas
    └── helpers/                      # Helpers reutilizáveis
        ├── NavigationTabs.tsx
        └── LayoutWrapper.tsx
```

---

## API de Uso

### Uso Básico (Mantém Compatibilidade)

```tsx
// API atual continua funcionando
<SideNavbar>
  <SideNavbar.Navigation>...</SideNavbar.Navigation>
  <SideNavbar.Content>...</SideNavbar.Content>
</SideNavbar>
```

### Novo Pattern com Subcomponentes

```tsx
<SideNavbar mode="full" variant="elevated">
  {/* Navbar com seu próprio contexto */}
  <SideNavbar.Navbar showToggle togglePosition="bottom">
    <SideNavbar.Navbar.Item icon={<Home />} label="Home" />
    <SideNavbar.Navbar.Item icon={<Settings />} label="Settings" />
    <SideNavbar.Navbar.Separator />
    <SideNavbar.Navbar.Item icon={<User />} label="Profile" />
  </SideNavbar.Navbar>

  {/* Sidebar com seu próprio contexto */}
  <SideNavbar.Sidebar>
    <SideNavbar.Sidebar.Header title="Dashboard" subtitle="Overview" />

    <SideNavbar.Sidebar.Content>
      <SideNavbar.Sidebar.Group id="stats" title="Statistics">
        <StatsList />
      </SideNavbar.Sidebar.Group>

      <SideNavbar.Sidebar.Group id="charts" title="Charts" defaultCollapsed>
        <ChartList />
      </SideNavbar.Sidebar.Group>
    </SideNavbar.Sidebar.Content>

    <SideNavbar.Sidebar.Footer>
      <Button>Export Data</Button>
    </SideNavbar.Sidebar.Footer>
  </SideNavbar.Sidebar>
</SideNavbar>
```

### Toggle com Posicionamento Flexível

```tsx
// Toggle dentro do Navbar (novo)
<SideNavbar.Navbar showToggle togglePosition="bottom">
  <NavItems />
</SideNavbar.Navbar>

// Toggle flutuante na borda (existente)
<SideNavbar showToggle togglePosition="floating">
  ...
</SideNavbar>

// Toggle customizado em qualquer lugar
<SideNavbar showToggle={false}>
  <SideNavbar.Navbar>
    <NavItems />
    <SideNavbar.Toggle
      variant="ghost"
      icon={(collapsed) => collapsed ? <ChevronRight /> : <ChevronLeft />}
    />
  </SideNavbar.Navbar>
</SideNavbar>
```

---

## Stories a Criar/Melhorar

### 1. **Default** (melhorar)
- Usar novo pattern com Navbar e Sidebar

### 2. **NavigationOnly** (nova)
- Apenas Navbar, sem Sidebar

### 3. **WithGroups** (nova)
- Demonstra SidebarGroups colapsáveis

### 4. **CustomToggle** (nova)
- Diferentes posições e ícones do toggle

### 5. **Responsive** (nova)
- Demonstra comportamento mobile (overlay, push, collapse)

### 6. **Resizable** (nova)
- Demonstra drag-to-resize com snap points

### 7. **NavbarItems** (nova)
- Demonstra NavbarItem com badges, tooltips, active states

### 8. **FullFeatures** (nova)
- Combina todas as features

### 9. **IndividualProviders** (nova)
- Uso avançado com providers separados

---

## Fases de Implementação

### Fase 1: Criar Contextos dos Subcomponentes
1. `contexts/NavbarContext.tsx` - Contexto do Navbar
2. `contexts/SidebarContext.tsx` - Contexto do Sidebar
3. Atualizar `contexts/index.ts` com exports

### Fase 2: Criar Subcomponente Navbar
1. `components/Navbar/Navbar.tsx` - Container principal
2. `components/Navbar/NavbarToggle.tsx` - Toggle interno
3. `components/Navbar/NavbarItem.tsx` - Item de navegação
4. `components/Navbar/NavbarSeparator.tsx` - Separador

### Fase 3: Criar Subcomponente Sidebar
1. `components/Sidebar/Sidebar.tsx` - Container principal
2. `components/Sidebar/SidebarHeader.tsx` - Header
3. `components/Sidebar/SidebarContent.tsx` - Content
4. `components/Sidebar/SidebarFooter.tsx` - Footer
5. `components/Sidebar/SidebarGroup.tsx` - Group colapsável

### Fase 4: Atualizar SideNavbar Principal
1. Integrar Navbar e Sidebar como compound components
2. Manter Navigation e Content como aliases (backwards compat)
3. Melhorar posicionamento do Toggle

### Fase 5: Criar/Atualizar Stories
1. Atualizar stories existentes
2. Criar novas stories para features
3. Extrair helpers reutilizáveis

### Fase 6: Testes e Documentação
1. Adicionar testes para novos componentes
2. Verificar backwards compatibility
3. Atualizar tipos exportados

---

## Backwards Compatibility

```tsx
// ALIASES para manter compatibilidade
SideNavbar.Navigation = SideNavbar.Navbar;  // Alias
SideNavbar.Content = SideNavbar.Sidebar;    // Alias (parcial)
SideNavbar.Header = SideNavbar.Sidebar.Header;
SideNavbar.Footer = SideNavbar.Sidebar.Footer;
SideNavbar.Group = SideNavbar.Sidebar.Group;
```

---

## Arquivos a Criar

| Arquivo | Descrição |
|---------|-----------|
| `contexts/NavbarContext.tsx` | Contexto do Navbar |
| `contexts/SidebarContext.tsx` | Contexto do Sidebar |
| `components/Navbar/Navbar.tsx` | Subcomponente Navbar |
| `components/Navbar/NavbarToggle.tsx` | Toggle do Navbar |
| `components/Navbar/NavbarItem.tsx` | Item de navegação |
| `components/Navbar/NavbarSeparator.tsx` | Separador |
| `components/Sidebar/Sidebar.tsx` | Subcomponente Sidebar |
| `components/Sidebar/SidebarHeader.tsx` | Header do Sidebar |
| `components/Sidebar/SidebarContent.tsx` | Content do Sidebar |
| `components/Sidebar/SidebarFooter.tsx` | Footer do Sidebar |
| `components/Sidebar/SidebarGroup.tsx` | Group do Sidebar |
| `hooks/useNavbar.ts` | Hook do Navbar |
| `hooks/useSidebar.ts` | Hook do Sidebar |

## Arquivos a Modificar

| Arquivo | Alteração |
|---------|-----------|
| `SideNavbar.tsx` | Adicionar Navbar, Sidebar como compound |
| `SideNavbarToggle.tsx` | Melhorar posicionamento |
| `types/index.ts` | Adicionar tipos dos subcomponentes |
| `index.ts` | Exportar novos componentes |
| `SideNavbar.stories.tsx` | Atualizar e criar stories |

---

## Verificação

### Testes Unitários
```bash
npm run test -- --run src/ui/organisms/SideNavbar/
```

### Storybook
```bash
npm run storybook
# Verificar todas as stories do SideNavbar
```

### Checklist
- [ ] NavbarContext funciona isolado
- [ ] SidebarContext funciona isolado
- [ ] Contextos herdam corretamente do Root
- [ ] Toggle funciona em todas as posições
- [ ] Groups colapsam corretamente
- [ ] Backwards compatibility mantida
- [ ] Stories demonstram todas as features
- [ ] Todos os testes passam
