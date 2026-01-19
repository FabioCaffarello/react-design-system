---
name: Test Writer
description: Write comprehensive unit and integration tests
status: filled
generated: 2026-01-19
---

# Test Writer Agent Playbook

## Mission
The Test Writer agent is engaged when new components are created, features are added, or test coverage needs improvement. It writes comprehensive tests using Vitest and Testing Library, ensures accessibility testing, creates Storybook story tests, and maintains test coverage above 80%. This agent is essential for maintaining code quality and preventing regressions.

## Responsibilities
- Write comprehensive unit tests using Vitest + Testing Library
- Create Storybook story tests with `play` functions
- Ensure test coverage ≥ 80% (target: 90%)
- Write accessibility tests (keyboard navigation, ARIA, screen readers)
- Create test utilities and fixtures for reusable test patterns
- Maintain and update existing tests when components change
- Write E2E tests for critical user flows using Playwright

## Best Practices
- **Test Behavior, Not Implementation**: Test what users see/interact with, not internal state
- **Use Semantic Selectors**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
- **Test Edge Cases**: Empty states, error states, loading states, disabled states
- **Clear Test Names**: Descriptive test names that explain what is being tested
- **Accessibility First**: Always include accessibility tests for interactive components
- **Maintain Coverage**: Keep coverage above 80% for all components

## Key Project Resources
- Documentation index: [docs/README.md](../docs/README.md)
- Agent handbook: [agents/README.md](./README.md)
- Agent knowledge base: [AGENTS.md](../../AGENTS.md)
- Contributor guide: [CONTRIBUTING.md](../../CONTRIBUTING.md)

## Repository Starting Points
- `src/ui/**/*.test.tsx` — Unit test files co-located with components
- `src/ui/**/*.stories.tsx` — Storybook stories (include `play` functions for interaction tests)
- `tests/e2e/` — End-to-end tests using Playwright
- `docs/TESTING_STRATEGY.md` — Complete testing strategy and guidelines
- `docs/E2E_TESTING.md` — E2E testing guide

## Key Files
**Entry Points:**
- [`../../../src/ui/index.ts`](../../../src/ui/index.ts)
- [`../../../src/ui/utils/index.ts`](../../../src/ui/utils/index.ts)
- [`../../../src/ui/templates/index.ts`](../../../src/ui/templates/index.ts)
- [`../../../src/ui/utilities/index.ts`](../../../src/ui/utilities/index.ts)
- [`../../../src/ui/shared/index.ts`](../../../src/ui/shared/index.ts)
- [`../../../src/ui/themes/index.ts`](../../../src/ui/themes/index.ts)
- [`../../../src/ui/providers/index.ts`](../../../src/ui/providers/index.ts)
- [`../../../src/ui/tokens/index.ts`](../../../src/ui/tokens/index.ts)
- [`../../../src/ui/patterns/index.ts`](../../../src/ui/patterns/index.ts)
- [`../../../src/ui/molecules/index.ts`](../../../src/ui/molecules/index.ts)
- [`../../../src/ui/organisms/index.ts`](../../../src/ui/organisms/index.ts)
- [`../../../src/ui/layouts/index.ts`](../../../src/ui/layouts/index.ts)
- [`../../../src/ui/extensions/index.ts`](../../../src/ui/extensions/index.ts)
- [`../../../src/ui/atoms/index.ts`](../../../src/ui/atoms/index.ts)
- [`../../../src/ui/templates/DashboardLayout/index.ts`](../../../src/ui/templates/DashboardLayout/index.ts)
- [`../../../src/ui/utilities/Portal/index.ts`](../../../src/ui/utilities/Portal/index.ts)
- [`../../../src/ui/shared/validation/index.ts`](../../../src/ui/shared/validation/index.ts)
- [`../../../src/ui/shared/utils/index.ts`](../../../src/ui/shared/utils/index.ts)
- [`../../../src/ui/shared/patterns/index.ts`](../../../src/ui/shared/patterns/index.ts)
- [`../../../src/ui/shared/errors/index.ts`](../../../src/ui/shared/errors/index.ts)
- [`../../../src/ui/tokens/colors/index.ts`](../../../src/ui/tokens/colors/index.ts)
- [`../../../src/ui/patterns/SearchAndFilterPattern/index.ts`](../../../src/ui/patterns/SearchAndFilterPattern/index.ts)
- [`../../../src/ui/patterns/FormWizardPattern/index.ts`](../../../src/ui/patterns/FormWizardPattern/index.ts)
- [`../../../src/ui/patterns/DataTablePattern/index.ts`](../../../src/ui/patterns/DataTablePattern/index.ts)
- [`../../../src/ui/molecules/TimePicker/index.ts`](../../../src/ui/molecules/TimePicker/index.ts)
- [`../../../src/ui/molecules/Tabs/index.ts`](../../../src/ui/molecules/Tabs/index.ts)
- [`../../../src/ui/molecules/SearchInput/index.ts`](../../../src/ui/molecules/SearchInput/index.ts)
- [`../../../src/ui/molecules/Rating/index.ts`](../../../src/ui/molecules/Rating/index.ts)
- [`../../../src/ui/molecules/Popover/index.ts`](../../../src/ui/molecules/Popover/index.ts)
- [`../../../src/ui/molecules/PageHeader/index.ts`](../../../src/ui/molecules/PageHeader/index.ts)
- [`../../../src/ui/molecules/Navigation/index.ts`](../../../src/ui/molecules/Navigation/index.ts)
- [`../../../src/ui/molecules/MultiSelect/index.ts`](../../../src/ui/molecules/MultiSelect/index.ts)
- [`../../../src/ui/molecules/Menu/index.ts`](../../../src/ui/molecules/Menu/index.ts)
- [`../../../src/ui/molecules/Header/index.ts`](../../../src/ui/molecules/Header/index.ts)
- [`../../../src/ui/molecules/Form/index.ts`](../../../src/ui/molecules/Form/index.ts)
- [`../../../src/ui/molecules/FileUpload/index.ts`](../../../src/ui/molecules/FileUpload/index.ts)
- [`../../../src/ui/molecules/Drawer/index.ts`](../../../src/ui/molecules/Drawer/index.ts)
- [`../../../src/ui/molecules/DatePicker/index.ts`](../../../src/ui/molecules/DatePicker/index.ts)
- [`../../../src/ui/molecules/ColorPicker/index.ts`](../../../src/ui/molecules/ColorPicker/index.ts)
- [`../../../src/ui/molecules/ButtonGroup/index.ts`](../../../src/ui/molecules/ButtonGroup/index.ts)
- [`../../../src/ui/molecules/Autocomplete/index.ts`](../../../src/ui/molecules/Autocomplete/index.ts)
- [`../../../src/ui/molecules/Accordion/index.ts`](../../../src/ui/molecules/Accordion/index.ts)
- [`../../../src/ui/organisms/Toast/index.ts`](../../../src/ui/organisms/Toast/index.ts)
- [`../../../src/ui/organisms/Timeline/index.ts`](../../../src/ui/organisms/Timeline/index.ts)
- [`../../../src/ui/organisms/Table/index.ts`](../../../src/ui/organisms/Table/index.ts)
- [`../../../src/ui/organisms/Stepper/index.ts`](../../../src/ui/organisms/Stepper/index.ts)
- [`../../../src/ui/organisms/SideNavbar/index.ts`](../../../src/ui/organisms/SideNavbar/index.ts)
- [`../../../src/ui/organisms/Dialog/index.ts`](../../../src/ui/organisms/Dialog/index.ts)
- [`../../../src/ui/organisms/DataGrid/index.ts`](../../../src/ui/organisms/DataGrid/index.ts)
- [`../../../src/ui/organisms/CommandPalette/index.ts`](../../../src/ui/organisms/CommandPalette/index.ts)
- [`../../../src/ui/layouts/Stack/index.ts`](../../../src/ui/layouts/Stack/index.ts)
- [`../../../src/ui/layouts/Container/index.ts`](../../../src/ui/layouts/Container/index.ts)
- [`../../../src/ui/extensions/flow/index.ts`](../../../src/ui/extensions/flow/index.ts)
- [`../../../src/ui/atoms/Switch/index.ts`](../../../src/ui/atoms/Switch/index.ts)
- [`../../../src/ui/atoms/Slider/index.ts`](../../../src/ui/atoms/Slider/index.ts)
- [`../../../src/ui/atoms/Separator/index.ts`](../../../src/ui/atoms/Separator/index.ts)
- [`../../../src/ui/atoms/NavLink/index.ts`](../../../src/ui/atoms/NavLink/index.ts)
- [`../../../src/ui/atoms/Chip/index.ts`](../../../src/ui/atoms/Chip/index.ts)
- [`../../../src/ui/atoms/Avatar/index.ts`](../../../src/ui/atoms/Avatar/index.ts)
- [`../../../src/ui/organisms/SideNavbar/utils/index.ts`](../../../src/ui/organisms/SideNavbar/utils/index.ts)
- [`../../../src/ui/organisms/SideNavbar/types/index.ts`](../../../src/ui/organisms/SideNavbar/types/index.ts)
- [`../../../src/ui/organisms/SideNavbar/providers/index.ts`](../../../src/ui/organisms/SideNavbar/providers/index.ts)
- [`../../../src/ui/organisms/SideNavbar/contexts/index.ts`](../../../src/ui/organisms/SideNavbar/contexts/index.ts)
- [`../../../src/ui/organisms/SideNavbar/components/index.ts`](../../../src/ui/organisms/SideNavbar/components/index.ts)
- [`../../../src/ui/extensions/flow/utils/index.ts`](../../../src/ui/extensions/flow/utils/index.ts)
- [`../../../src/ui/extensions/flow/styles/index.ts`](../../../src/ui/extensions/flow/styles/index.ts)
- [`../../../src/ui/extensions/flow/strategies/index.ts`](../../../src/ui/extensions/flow/strategies/index.ts)
- [`../../../src/ui/extensions/flow/registries/index.ts`](../../../src/ui/extensions/flow/registries/index.ts)
- [`../../../src/ui/extensions/flow/providers/index.ts`](../../../src/ui/extensions/flow/providers/index.ts)
- [`../../../src/ui/extensions/flow/molecules/index.ts`](../../../src/ui/extensions/flow/molecules/index.ts)
- [`../../../src/ui/extensions/flow/hooks/index.ts`](../../../src/ui/extensions/flow/hooks/index.ts)
- [`../../../src/ui/extensions/flow/factories/index.ts`](../../../src/ui/extensions/flow/factories/index.ts)
- [`../../../src/ui/extensions/flow/context/index.ts`](../../../src/ui/extensions/flow/context/index.ts)
- [`../../../src/ui/extensions/flow/atoms/index.ts`](../../../src/ui/extensions/flow/atoms/index.ts)
- [`../../../src/ui/extensions/flow/components/index.ts`](../../../src/ui/extensions/flow/components/index.ts)
- [`../../../src/ui/organisms/SideNavbar/components/Sidebar/index.ts`](../../../src/ui/organisms/SideNavbar/components/Sidebar/index.ts)
- [`../../../src/ui/organisms/SideNavbar/components/Navbar/index.ts`](../../../src/ui/organisms/SideNavbar/components/Navbar/index.ts)
- [`../../../src/main.tsx`](../../../src/main.tsx)
- [`../../../src/app.tsx`](../../../src/app.tsx)

**Pattern Implementations:**
- Factory: [`ZIndexTokenFactory`](src/ui/tokens/z-index.ts), [`TypographyTokenFactory`](src/ui/tokens/typography.ts), [`TokensFactory`](src/ui/tokens/tokens.factory.ts), [`SpacingTokenFactory`](src/ui/tokens/spacing.ts), [`ShadowTokenFactory`](src/ui/tokens/shadows.ts), [`RadiusTokenFactory`](src/ui/tokens/radius.ts), [`OpacityTokenFactory`](src/ui/tokens/opacity.ts), [`GradientTokenFactory`](src/ui/tokens/gradients.ts), [`ColorTokenFactory`](src/ui/tokens/colors.ts), [`BreakpointTokenFactory`](src/ui/tokens/breakpoints.ts), [`BorderTokenFactory`](src/ui/tokens/borders.ts), [`AnimationTokenFactory`](src/ui/tokens/animations.ts), [`NodeFactory`](src/ui/extensions/flow/utils/nodeFactory.ts), [`EdgeFactory`](src/ui/extensions/flow/utils/edgeFactory.ts), [`FlowFactory`](src/ui/extensions/flow/factories/FlowFactory.ts)
- Builder: [`ThemeBuilder`](src/ui/themes/ThemeBuilder.ts), [`NodeBuilder`](src/ui/extensions/flow/factories/builders/NodeBuilder.ts), [`EdgeBuilder`](src/ui/extensions/flow/factories/builders/EdgeBuilder.ts)

## Architecture Context

### Config
Configuration and constants
- **Directories**: `.`, `src/ui/providers`, `src/ui/organisms/SideNavbar/providers`, `src/ui/organisms/SideNavbar/contexts`, `storybook-static/assets`
- **Symbols**: 8 total
- **Key exports**: [`DesignSystemConfig`](src/ui/providers/ConfigProvider.tsx#L22), [`ConfigContextValue`](src/ui/providers/ConfigProvider.tsx#L104), [`ConfigProviderProps`](src/ui/providers/ConfigProvider.tsx#L126), [`ConfigProvider`](src/ui/providers/ConfigProvider.tsx#L151), [`useConfig`](src/ui/providers/ConfigProvider.tsx#L250), [`SideNavbarConfigProvider`](src/ui/organisms/SideNavbar/providers/SideNavbarConfigProvider.tsx#L22), [`useSideNavbarConfig`](src/ui/organisms/SideNavbar/contexts/SideNavbarConfigContext.tsx#L16), [`useSideNavbarConfigRequired`](src/ui/organisms/SideNavbar/contexts/SideNavbarConfigContext.tsx#L24)

### Repositories
Data access and persistence
- **Directories**: `scripts`, `src/ui/patterns/DataTablePattern`, `src/ui/organisms/DataGrid`, `src/ui/extensions/flow/utils`, `src/ui/extensions/flow/components`, `storybook-static/assets`
- **Symbols**: 46 total
- **Key exports**: [`NodeMetadata`](src/ui/extensions/flow/utils/nodeDataHelpers.ts#L15), [`enrichNodeData`](src/ui/extensions/flow/utils/nodeDataHelpers.ts#L25), [`validateNodeData`](src/ui/extensions/flow/utils/nodeDataHelpers.ts#L48), [`getNodeHierarchy`](src/ui/extensions/flow/utils/nodeDataHelpers.ts#L109), [`getNodeRelationships`](src/ui/extensions/flow/utils/nodeDataHelpers.ts#L170), [`updateNodeHierarchy`](src/ui/extensions/flow/utils/nodeDataHelpers.ts#L195), [`getDescendantIds`](src/ui/extensions/flow/utils/nodeDataHelpers.ts#L216), [`getAncestorIds`](src/ui/extensions/flow/utils/nodeDataHelpers.ts#L238), [`EdgeMetadata`](src/ui/extensions/flow/utils/edgeDataHelpers.ts#L14), [`enrichEdgeData`](src/ui/extensions/flow/utils/edgeDataHelpers.ts#L23), [`validateEdgeData`](src/ui/extensions/flow/utils/edgeDataHelpers.ts#L45), [`getEdgeWeight`](src/ui/extensions/flow/utils/edgeDataHelpers.ts#L113), [`isBidirectional`](src/ui/extensions/flow/utils/edgeDataHelpers.ts#L120), [`getReverseEdge`](src/ui/extensions/flow/utils/edgeDataHelpers.ts#L140), [`getNodeEdgeWeight`](src/ui/extensions/flow/utils/edgeDataHelpers.ts#L152), [`getEdgesByRelationship`](src/ui/extensions/flow/utils/edgeDataHelpers.ts#L178), [`getEdgesByCategory`](src/ui/extensions/flow/utils/edgeDataHelpers.ts#L192), [`getEdgesByTags`](src/ui/extensions/flow/utils/edgeDataHelpers.ts#L202), [`PlaygroundSnapshot`](src/ui/extensions/flow/utils/PlaygroundPersistence.ts#L12), [`PlaygroundPersistenceOptions`](src/ui/extensions/flow/utils/PlaygroundPersistence.ts#L29), [`savePlaygroundState`](src/ui/extensions/flow/utils/PlaygroundPersistence.ts#L46), [`loadPlaygroundState`](src/ui/extensions/flow/utils/PlaygroundPersistence.ts#L85), [`loadVersionHistory`](src/ui/extensions/flow/utils/PlaygroundPersistence.ts#L105), [`getVersionById`](src/ui/extensions/flow/utils/PlaygroundPersistence.ts#L121), [`deleteVersion`](src/ui/extensions/flow/utils/PlaygroundPersistence.ts#L132), [`clearPlaygroundState`](src/ui/extensions/flow/utils/PlaygroundPersistence.ts#L150), [`exportToJSON`](src/ui/extensions/flow/utils/PlaygroundPersistence.ts#L163), [`importFromJSON`](src/ui/extensions/flow/utils/PlaygroundPersistence.ts#L170), [`generateShareableURL`](src/ui/extensions/flow/utils/PlaygroundPersistence.ts#L187), [`loadFromShareableURL`](src/ui/extensions/flow/utils/PlaygroundPersistence.ts#L198), [`useAutoSave`](src/ui/extensions/flow/utils/PlaygroundPersistence.ts#L216), [`DataGridColumn`](src/ui/organisms/DataGrid/DataGrid.tsx#L10), [`DataGridGroup`](src/ui/organisms/DataGrid/DataGrid.tsx#L18), [`DataGridProps`](src/ui/organisms/DataGrid/DataGrid.tsx#L23), [`DataTableColumn`](src/ui/patterns/DataTablePattern/DataTablePattern.tsx#L12), [`DataTablePatternProps`](src/ui/patterns/DataTablePattern/DataTablePattern.tsx#L20)

### Components
UI components and views
- **Directories**: `scripts`, `src/ui/molecules/PageHeader`, `src/ui/organisms/SideNavbar/components`, `src/ui/extensions/flow/hooks`, `src/ui/extensions/flow/components`, `src/ui/organisms/SideNavbar/components/Sidebar`, `src/ui/organisms/SideNavbar/components/Navbar`, `src/docs/components`, `src/ui/molecules/Header/components`, `storybook-static/assets`
- **Symbols**: 93 total
- **Key exports**: [`PageHeaderVariant`](src/ui/molecules/PageHeader/types.ts#L13), [`PageHeaderProps`](src/ui/molecules/PageHeader/types.ts#L20), [`UseFlowViewportReturn`](src/ui/extensions/flow/hooks/useFlowViewport.ts#L16), [`useFlowViewport`](src/ui/extensions/flow/hooks/useFlowViewport.ts#L51), [`PageHeader`](src/ui/molecules/PageHeader/PageHeader.tsx#L56), [`SideNavbarResizeHandleProps`](src/ui/organisms/SideNavbar/components/SideNavbarResizeHandle.tsx#L8), [`SideNavbarResizeHandle`](src/ui/organisms/SideNavbar/components/SideNavbarResizeHandle.tsx#L24), [`SideNavbarGroupProps`](src/ui/organisms/SideNavbar/components/SideNavbarGroup.tsx#L10), [`SideNavbarBackdropProps`](src/ui/organisms/SideNavbar/components/SideNavbarBackdrop.tsx#L8), [`SideNavbarBackdrop`](src/ui/organisms/SideNavbar/components/SideNavbarBackdrop.tsx#L35), [`HeaderNavigationProps`](src/ui/molecules/Header/components/HeaderNavigation.tsx#L15), [`HeaderNavigation`](src/ui/molecules/Header/components/HeaderNavigation.tsx#L40), [`HeaderMobileMenuProps`](src/ui/molecules/Header/components/HeaderMobileMenu.tsx#L17), [`HeaderLogoProps`](src/ui/molecules/Header/components/HeaderLogo.tsx#L17), [`HeaderLogo`](src/ui/molecules/Header/components/HeaderLogo.tsx#L42), [`HeaderHamburgerProps`](src/ui/molecules/Header/components/HeaderHamburger.tsx#L18), [`HeaderHamburger`](src/ui/molecules/Header/components/HeaderHamburger.tsx#L61), [`HeaderActionsProps`](src/ui/molecules/Header/components/HeaderActions.tsx#L15), [`HeaderActions`](src/ui/molecules/Header/components/HeaderActions.tsx#L40), [`ViewportLogger`](src/ui/extensions/flow/components/ViewportLogger.tsx#L15), [`SettingsPanelProps`](src/ui/extensions/flow/components/SettingsPanel.tsx#L16), [`SettingsPanel`](src/ui/extensions/flow/components/SettingsPanel.tsx#L25), [`ReactFlowPropsPanelProps`](src/ui/extensions/flow/components/ReactFlowPropsPanel.tsx#L21), [`PlaygroundTabId`](src/ui/extensions/flow/components/PlaygroundTabs.tsx#L24), [`PlaygroundTab`](src/ui/extensions/flow/components/PlaygroundTabs.tsx#L33), [`PlaygroundTabsProps`](src/ui/extensions/flow/components/PlaygroundTabs.tsx#L93), [`PlaygroundSidebarContentProps`](src/ui/extensions/flow/components/PlaygroundSidebarContent.tsx#L20), [`PlaygroundSidebarProps`](src/ui/extensions/flow/components/PlaygroundSidebar.tsx#L19), [`PlaygroundSearchProps`](src/ui/extensions/flow/components/PlaygroundSearch.tsx#L21), [`OnboardingStep`](src/ui/extensions/flow/components/PlaygroundOnboarding.tsx#L17), [`PlaygroundOnboardingProps`](src/ui/extensions/flow/components/PlaygroundOnboarding.tsx#L54), [`PlaygroundLayoutProps`](src/ui/extensions/flow/components/PlaygroundLayout.tsx#L148), [`PlaygroundLayout`](src/ui/extensions/flow/components/PlaygroundLayout.tsx#L155), [`PlaygroundDevToolsProps`](src/ui/extensions/flow/components/PlaygroundDevTools.tsx#L22), [`PlaygroundBreadcrumbsProps`](src/ui/extensions/flow/components/PlaygroundBreadcrumbs.tsx#L17), [`NodeTypesPanelProps`](src/ui/extensions/flow/components/NodeTypesPanel.tsx#L29), [`NodeEditorProps`](src/ui/extensions/flow/components/NodeEditor.tsx#L17), [`LayoutConfigPanelProps`](src/ui/extensions/flow/components/LayoutConfigPanel.tsx#L19), [`LayoutConfigPanel`](src/ui/extensions/flow/components/LayoutConfigPanel.tsx#L34), [`LayoutApplierProps`](src/ui/extensions/flow/components/LayoutApplier.tsx#L12), [`LayoutApplier`](src/ui/extensions/flow/components/LayoutApplier.tsx#L27), [`HandlePosition`](src/ui/extensions/flow/components/HandlePositionsDropdown.tsx#L16), [`HandlePositionsDropdown`](src/ui/extensions/flow/components/HandlePositionsDropdown.tsx#L24), [`ExportPanelProps`](src/ui/extensions/flow/components/ExportPanel.tsx#L35), [`EdgeTypesPanelProps`](src/ui/extensions/flow/components/EdgeTypesPanel.tsx#L24), [`EdgeEditorProps`](src/ui/extensions/flow/components/EdgeEditor.tsx#L17), [`DragNDropSidebarProps`](src/ui/extensions/flow/components/DragNDropSidebar.tsx#L14), [`CodePreviewProps`](src/ui/extensions/flow/components/CodePreview.tsx#L15), [`BackgroundConfigPanelProps`](src/ui/extensions/flow/components/BackgroundConfigPanel.tsx#L28), [`SidebarSlotContentProps`](src/ui/organisms/SideNavbar/components/Sidebar/SidebarSlotContent.tsx#L6), [`SidebarSlotContent`](src/ui/organisms/SideNavbar/components/Sidebar/SidebarSlotContent.tsx#L34), [`SidebarSlotProps`](src/ui/organisms/SideNavbar/components/Sidebar/SidebarSlot.tsx#L6), [`SidebarSlot`](src/ui/organisms/SideNavbar/components/Sidebar/SidebarSlot.tsx#L45), [`SidebarHeader`](src/ui/organisms/SideNavbar/components/Sidebar/SidebarHeader.tsx#L19), [`SidebarFooter`](src/ui/organisms/SideNavbar/components/Sidebar/SidebarFooter.tsx#L21), [`SidebarContent`](src/ui/organisms/SideNavbar/components/Sidebar/SidebarContent.tsx#L24), [`NavbarToggle`](src/ui/organisms/SideNavbar/components/Navbar/NavbarToggle.tsx#L23)

### Generators
Content and object generation
- **Directories**: `tests/e2e`, `src/ui/themes`, `src/ui/extensions/flow/factories`, `src/ui/extensions/flow/factories/builders`, `storybook-static/assets`
- **Symbols**: 18 total
- **Key exports**: [`ThemeBuilder`](src/ui/themes/ThemeBuilder.ts#L11), [`FlowFactory`](src/ui/extensions/flow/factories/FlowFactory.ts#L20), [`NodeBuilder`](src/ui/extensions/flow/factories/builders/NodeBuilder.ts#L16), [`EdgeBuilder`](src/ui/extensions/flow/factories/builders/EdgeBuilder.ts#L16)

### Utils
Shared utilities and helpers
- **Directories**: `src/ui/utils`, `src/ui/utilities`, `src/ui/shared`, `src/ui/themes`, `src/ui/utilities/Portal`, `src/ui/shared/validation`, `src/ui/shared/utils`, `src/ui/shared/patterns`, `src/ui/shared/errors`, `src/ui/tokens/colors`, `src/ui/organisms/SideNavbar/utils`, `src/ui/extensions/flow/utils`, `src/ui/extensions/flow/hooks`, `storybook-static/assets`, `storybook-static/sb-addons/storybook-core-server-presets-0`
- **Symbols**: 147 total
- **Key exports**: [`variant`](src/ui/utils/variants.ts#L23), [`size`](src/ui/utils/variants.ts#L41), [`state`](src/ui/utils/variants.ts#L73), [`responsive`](src/ui/utils/variants.ts#L104), [`typography`](src/ui/utils/variants.ts#L121), [`radius`](src/ui/utils/variants.ts#L147), [`combine`](src/ui/utils/variants.ts#L165), [`cva`](src/ui/utils/cva.ts#L72), [`cssVar`](src/ui/utils/css-variables.ts#L17), [`cssVarValue`](src/ui/utils/css-variables.ts#L29), [`createCSSVars`](src/ui/utils/css-variables.ts#L44), [`cn`](src/ui/utils/cn.ts#L43), [`mergeDeep`](src/ui/themes/utils.ts#L10), [`toCSSVariableName`](src/ui/themes/utils.ts#L41), [`applyCSSVariables`](src/ui/themes/utils.ts#L51), [`removeCSSVariables`](src/ui/themes/utils.ts#L63), [`IdGenerator`](src/ui/shared/utils/idGenerator.ts#L8), [`OrderableItem`](src/ui/shared/utils/comparators.ts#L5), [`compareByOrder`](src/ui/shared/utils/comparators.ts#L15), [`compareByName`](src/ui/shared/utils/comparators.ts#L24), [`compareByMultiple`](src/ui/shared/utils/comparators.ts#L37), [`CategorizedEntry`](src/ui/shared/patterns/CategorizedRegistry.ts#L7), [`RegistryEntry`](src/ui/shared/patterns/BaseRegistry.ts#L12), [`RegistryOptions`](src/ui/shared/patterns/BaseRegistry.ts#L25), [`RegistryError`](src/ui/shared/errors/RegistryErrors.ts#L5), [`EntryNotFoundError`](src/ui/shared/errors/RegistryErrors.ts#L12), [`DuplicateEntryError`](src/ui/shared/errors/RegistryErrors.ts#L19), [`InvalidEntryError`](src/ui/shared/errors/RegistryErrors.ts#L26), [`getColor`](src/ui/tokens/colors/utils.ts#L24), [`getSemanticColorValue`](src/ui/tokens/colors/utils.ts#L61), [`getColorClass`](src/ui/tokens/colors/utils.ts#L98), [`getSemanticColorClass`](src/ui/tokens/colors/utils.ts#L125), [`getHoverColorClass`](src/ui/tokens/colors/utils.ts#L154), [`getFocusColorClass`](src/ui/tokens/colors/utils.ts#L166), [`getFocusRingClass`](src/ui/tokens/colors/utils.ts#L178), [`withOpacity`](src/ui/tokens/colors/utils.ts#L189), [`isLightColor`](src/ui/tokens/colors/utils.ts#L196), [`getContrastColor`](src/ui/tokens/colors/utils.ts#L208), [`blendColors`](src/ui/tokens/colors/utils.ts#L228), [`lighten`](src/ui/tokens/colors/utils.ts#L244), [`darken`](src/ui/tokens/colors/utils.ts#L251), [`parseWidthToPixels`](src/ui/organisms/SideNavbar/utils/parseWidth.ts#L14), [`validateWidthBounds`](src/ui/organisms/SideNavbar/utils/parseWidth.ts#L34), [`clampWidth`](src/ui/organisms/SideNavbar/utils/parseWidth.ts#L50), [`ParsedKeyboardShortcut`](src/ui/organisms/SideNavbar/utils/parseKeyboardShortcut.ts#L4), [`parseKeyboardShortcut`](src/ui/organisms/SideNavbar/utils/parseKeyboardShortcut.ts#L52), [`formatKeyboardShortcut`](src/ui/organisms/SideNavbar/utils/parseKeyboardShortcut.ts#L139), [`FlowValidator`](src/ui/extensions/flow/utils/validation.ts#L15), [`generateShareableLink`](src/ui/extensions/flow/utils/shareUtils.ts#L12), [`loadFromShareableLink`](src/ui/extensions/flow/utils/shareUtils.ts#L28), [`exportPlaygroundState`](src/ui/extensions/flow/utils/shareUtils.ts#L46), [`importPlaygroundState`](src/ui/extensions/flow/utils/shareUtils.ts#L62), [`getPropsByCategory`](src/ui/extensions/flow/utils/reactFlowPropsDefinitions.ts#L182), [`getPropDefinition`](src/ui/extensions/flow/utils/reactFlowPropsDefinitions.ts#L189), [`filterReactFlowProps`](src/ui/extensions/flow/utils/propFilters.ts#L51), [`filterBooleanAttributes`](src/ui/extensions/flow/utils/propFilters.ts#L71), [`filterAllProps`](src/ui/extensions/flow/utils/propFilters.ts#L91), [`FlowTemplate`](src/ui/extensions/flow/utils/playgroundTemplates.ts#L10), [`getTemplatesByTag`](src/ui/extensions/flow/utils/playgroundTemplates.ts#L182), [`searchTemplates`](src/ui/extensions/flow/utils/playgroundTemplates.ts#L189), [`getTemplateById`](src/ui/extensions/flow/utils/playgroundTemplates.ts#L202), [`getTemplatesByCategory`](src/ui/extensions/flow/utils/playgroundTemplates.ts#L209), [`getPreviewGridStyle`](src/ui/extensions/flow/utils/playgroundStyles.ts#L100), [`getCardPreviewStyle`](src/ui/extensions/flow/utils/playgroundStyles.ts#L109), [`PlaygroundRoute`](src/ui/extensions/flow/utils/playgroundRouting.ts#L9), [`parseRouteFromHash`](src/ui/extensions/flow/utils/playgroundRouting.ts#L18), [`generateHashFromRoute`](src/ui/extensions/flow/utils/playgroundRouting.ts#L53), [`updateRoute`](src/ui/extensions/flow/utils/playgroundRouting.ts#L71), [`onRouteChange`](src/ui/extensions/flow/utils/playgroundRouting.ts#L86), [`getCurrentRoute`](src/ui/extensions/flow/utils/playgroundRouting.ts#L109), [`validateBackgroundConfig`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L19), [`validateReactFlowConfig`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L32), [`exportFlowToJSON`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L86), [`importFlowFromJSON`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L104), [`downloadFlowAsJSON`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L116), [`loadFlowFromFile`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L137), [`generateNodeId`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L158), [`generateEdgeId`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L165), [`createNode`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L172), [`createEdge`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L190), [`validateFlow`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L208), [`getFlowStats`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L259), [`cloneNode`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L307), [`cloneEdge`](src/ui/extensions/flow/utils/playgroundHelpers.ts#L321), [`debounce`](src/ui/extensions/flow/utils/performanceUtils.ts#L10), [`throttle`](src/ui/extensions/flow/utils/performanceUtils.ts#L32), [`rafThrottle`](src/ui/extensions/flow/utils/performanceUtils.ts#L50), [`memoize`](src/ui/extensions/flow/utils/performanceUtils.ts#L68), [`BatchUpdater`](src/ui/extensions/flow/utils/performanceUtils.ts#L90), [`createBatchUpdater`](src/ui/extensions/flow/utils/performanceUtils.ts#L118), [`measureRenderTime`](src/ui/extensions/flow/utils/performanceUtils.ts#L125), [`shouldVirtualize`](src/ui/extensions/flow/utils/performanceUtils.ts#L135), [`calculateOptimalBatchSize`](src/ui/extensions/flow/utils/performanceUtils.ts#L146), [`NodeTypeDefinition`](src/ui/extensions/flow/utils/nodeTypes.ts#L17), [`NodeTypeRegistry`](src/ui/extensions/flow/utils/nodeTypes.ts#L46), [`NodeTemplate`](src/ui/extensions/flow/utils/nodeFactory.ts#L14), [`NodeFactory`](src/ui/extensions/flow/utils/nodeFactory.ts#L26), [`LayoutStrategy`](src/ui/extensions/flow/utils/layoutEngine.ts#L13), [`DagreLayoutStrategy`](src/ui/extensions/flow/utils/layoutEngine.ts#L23), [`ELKLayoutStrategy`](src/ui/extensions/flow/utils/layoutEngine.ts#L96), [`ForceDirectedLayoutStrategy`](src/ui/extensions/flow/utils/layoutEngine.ts#L150), [`LayoutEngine`](src/ui/extensions/flow/utils/layoutEngine.ts#L193), [`getNodeIntersection`](src/ui/extensions/flow/utils/geometryUtils.ts#L17), [`getEdgePosition`](src/ui/extensions/flow/utils/geometryUtils.ts#L49), [`getEdgeParams`](src/ui/extensions/flow/utils/geometryUtils.ts#L78), [`createCircularFlow`](src/ui/extensions/flow/utils/geometryUtils.ts#L100), [`getDistance`](src/ui/extensions/flow/utils/geometryUtils.ts#L162), [`getAngle`](src/ui/extensions/flow/utils/geometryUtils.ts#L171), [`getNodesBoundingBox`](src/ui/extensions/flow/utils/geometryUtils.ts#L180), [`getNodeIntersection`](src/ui/extensions/flow/utils/floatingEdgeUtils.ts#L14), [`getEdgePosition`](src/ui/extensions/flow/utils/floatingEdgeUtils.ts#L44), [`getEdgeParams`](src/ui/extensions/flow/utils/floatingEdgeUtils.ts#L71), [`EdgeTypeDefinition`](src/ui/extensions/flow/utils/edgeTypes.ts#L17), [`EdgeTypeRegistry`](src/ui/extensions/flow/utils/edgeTypes.ts#L44), [`EdgeTemplate`](src/ui/extensions/flow/utils/edgeFactory.ts#L14), [`EdgeFactory`](src/ui/extensions/flow/utils/edgeFactory.ts#L27), [`generateCSSVariables`](src/ui/extensions/flow/utils/cssUtils.ts#L13), [`applyFlowCSSVariables`](src/ui/extensions/flow/utils/cssUtils.ts#L20), [`getCSSVariable`](src/ui/extensions/flow/utils/cssUtils.ts#L35), [`setCSSVariable`](src/ui/extensions/flow/utils/cssUtils.ts#L43), [`tokenToCSSVariable`](src/ui/extensions/flow/utils/cssUtils.ts#L55), [`CodeGenerationOptions`](src/ui/extensions/flow/utils/codeGenerator.ts#L11), [`generateReactCode`](src/ui/extensions/flow/utils/codeGenerator.ts#L20), [`formatCode`](src/ui/extensions/flow/utils/codeGenerator.ts#L257), [`downloadCode`](src/ui/extensions/flow/utils/codeGenerator.ts#L278), [`BackgroundPreset`](src/ui/extensions/flow/utils/backgroundPresets.ts#L12), [`getBackgroundPreset`](src/ui/extensions/flow/utils/backgroundPresets.ts#L200), [`getBackgroundPresetName`](src/ui/extensions/flow/utils/backgroundPresets.ts#L207), [`PlaygroundState`](src/ui/extensions/flow/utils/PlaygroundStateManager.ts#L14), [`StateUpdate`](src/ui/extensions/flow/utils/PlaygroundStateManager.ts#L27), [`StateMiddleware`](src/ui/extensions/flow/utils/PlaygroundStateManager.ts#L32), [`PlaygroundStateManager`](src/ui/extensions/flow/utils/PlaygroundStateManager.ts#L39), [`usePlaygroundStateManager`](src/ui/extensions/flow/utils/PlaygroundStateManager.ts#L216), [`createLoggingMiddleware`](src/ui/extensions/flow/utils/PlaygroundStateManager.ts#L229), [`createPersistenceMiddleware`](src/ui/extensions/flow/utils/PlaygroundStateManager.ts#L241), [`loadPersistedState`](src/ui/extensions/flow/utils/PlaygroundStateManager.ts#L266), [`UseFlowUtilsReturn`](src/ui/extensions/flow/hooks/useFlowUtils.ts#L17), [`useFlowUtils`](src/ui/extensions/flow/hooks/useFlowUtils.ts#L51), [`PortalProps`](src/ui/utilities/Portal/Portal.tsx#L4), [`Portal`](src/ui/utilities/Portal/Portal.tsx#L33)

### Models
Data structures and domain objects
- **Directories**: `src/ui/shared/validation`
- **Symbols**: 2 total
- **Key exports**: [`createValidator`](src/ui/shared/validation/schemas.ts#L39), [`validateOrThrow`](src/ui/shared/validation/schemas.ts#L58)
## Key Symbols for This Agent
- [`generateVisualRegressionTests`](scripts/visual-regression.ts#L14) (function)
- [`validateStoryFile`](scripts/validate-stories.ts#L46) (function)
- [`validateStoryFile`](scripts/validate-stories-enhanced.ts#L23) (function)
- [`updateStory`](scripts/update-stories.ts#L64) (function)
- [`generateStoriesList`](scripts/mcp-generate-docs.ts#L94) (function)
- [`generateStoryForComponent`](scripts/generate-stories.ts#L61) (function)
- [`ToastTestComponent`](src/ui/organisms/Toast/Toast.test.tsx#L9) (function)
- [`TestComponent`](src/ui/extensions/flow/organisms/FlowProvider.test.tsx#L9) (function)

## Documentation Touchpoints
- [Documentation Index](../docs/README.md)
- [Project Overview](../docs/project-overview.md)
- [Architecture Notes](../docs/architecture.md)
- [Development Workflow](../docs/development-workflow.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [Glossary & Domain Concepts](../docs/glossary.md)
- [Data Flow & Integrations](../docs/data-flow.md)
- [Security & Compliance Notes](../docs/security.md)
- [Tooling & Productivity Guide](../docs/tooling.md)

## Collaboration Checklist

1. Confirm assumptions with issue reporters or maintainers.
2. Review open pull requests affecting this area.
3. Update the relevant doc section listed above.
4. Capture learnings back in [docs/README.md](../docs/README.md).

## Testing Framework & Conventions

### Framework Stack
- **Vitest 4**: Unit and integration testing
- **Testing Library**: React component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **Playwright**: End-to-end testing
- **Storybook Test Runner**: Story-based testing

### Test File Organization
```
src/ui/atoms/Button/
├── Button.tsx           # Component
├── Button.test.tsx      # Unit tests
├── Button.stories.tsx   # Storybook stories (with play functions)
└── index.ts            # Exports
```

### Test File Naming
- Unit tests: `ComponentName.test.tsx`
- Story files: `ComponentName.stories.tsx`
- E2E tests: `feature.spec.ts`

## Writing Tests

### Unit Test Structure
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('supports keyboard navigation', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button');
    button.focus();
    expect(document.activeElement).toBe(button);
  });
});
```

### Storybook Story Tests
```typescript
export const InteractionTest: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole('button');
    await userEvent.click(button);
    await expect(canvas.getByText('Clicked')).toBeInTheDocument();
  },
};
```

### E2E Test Example
```typescript
import { test, expect } from '@playwright/test';

test('button interaction in Storybook', async ({ page }) => {
  await page.goto('/?path=/story/atoms-button--primary');
  const button = page.getByRole('button');
  await button.click();
  // Assertions...
});
```

## Test Coverage Requirements

### Minimum Coverage
- **Lines**: 80%
- **Functions**: 80%
- **Branches**: 80%
- **Statements**: 80%

### Target Coverage
- **Lines**: 90%
- **Functions**: 90%
- **Branches**: 90%
- **Statements**: 90%

### Running Coverage
```bash
npm run test:coverage
```

## Test Categories by Component Type

### Atoms
- Basic rendering
- Props acceptance
- States (disabled, loading, etc.)
- Basic accessibility

### Molecules
- Component interactions
- Form validation
- Complex states
- Composition patterns

### Organisms
- Complete user flows
- State management
- Integration with providers
- Complex interactions

## Accessibility Testing

### Required Tests
- Keyboard navigation (Tab, Enter, Space, Arrow keys)
- ARIA attributes presence and correctness
- Focus management
- Screen reader compatibility (when possible)
- Color contrast (use Storybook a11y addon)

### Example Accessibility Test
```typescript
it('supports keyboard navigation', async () => {
  render(<Button>Click me</Button>);
  const button = screen.getByRole('button');
  
  // Tab to button
  await userEvent.tab();
  expect(button).toHaveFocus();
  
  // Activate with Enter
  await userEvent.keyboard('{Enter}');
  expect(handleClick).toHaveBeenCalled();
});
```

## Mocking Strategies

### Component Mocks
```typescript
vi.mock('../SomeComponent', () => ({
  SomeComponent: () => <div>Mocked Component</div>
}));
```

### Hook Mocks
```typescript
vi.mock('../../hooks/useCustomHook', () => ({
  useCustomHook: () => ({ value: 'mocked' })
}));
```

### API Mocks
Use Vitest's built-in mocking or MSW (Mock Service Worker) for API calls.

## CI/CD Integration

Tests run automatically on:
- Every push
- Every pull request
- Before merging to main
- Before releases

## Common Pitfalls to Avoid

❌ **Testing Implementation Details**
```typescript
// Bad
expect(component.state.value).toBe('test');

// Good
expect(screen.getByText('test')).toBeInTheDocument();
```

❌ **Fragile Selectors**
```typescript
// Bad
screen.getByTestId('button-123');

// Good
screen.getByRole('button', { name: /submit/i });
```

❌ **Missing Accessibility Tests**
Always test keyboard navigation and ARIA attributes for interactive components.

## Hand-off Notes

After writing tests, document:
- **Coverage Achieved**: Current coverage percentage
- **Test Types**: Unit, integration, E2E, accessibility
- **Edge Cases Covered**: List of edge cases tested
- **Accessibility Verified**: Keyboard nav, ARIA, screen readers
- **Follow-up**: Additional tests needed or improvements
