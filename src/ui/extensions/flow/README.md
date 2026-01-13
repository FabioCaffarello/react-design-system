# Flow Extension

Complete flow diagram system built on top of React Flow (@xyflow/react) with design system integration.

## Overview

The Flow extension provides a comprehensive solution for building interactive flow diagrams with:

- **FlowProvider**: Context provider that combines ReactFlowProvider with design system functionality
- **FlowCanvas**: Compound component for rendering flows with sub-components
- **Custom Nodes & Edges**: Pre-built components following design system patterns
- **Layout Engines**: Support for Dagre, ELK, and Force-Directed layouts (optional)
- **Validation**: Connection rules and flow validation
- **Theming**: Full support for light/dark themes
- **Performance**: Memoization, virtualization, and optimization

## Architecture

The Flow extension follows Atomic Design principles within its own structure:

- **Atoms**: `FlowHandle`, `FlowNodeWrapper` - Basic building blocks
- **Molecules**: `CustomNode`, `CustomEdge`, `FlowNodeToolbar` - Composed components
- **Organisms**: `FlowCanvas`, `FlowProvider` - Complex components with compound patterns

Additionally, the extension includes:

- **Factories**: Factory pattern for creating nodes and edges
- **Registries**: Registry pattern for managing node types, edge types, layouts, and plugins
- **Strategies**: Strategy pattern for layouts, edge routing, and animations
- **Contexts**: Specialized contexts for styles, events, and performance
- **Providers**: Specialized providers for theming, events, performance, and debugging
- **Hooks**: Specialized hooks for styles, performance, events, utils, selection, and viewport
- **Styles**: CSS variables and modules for theming
- **Utils**: Utility functions for CSS, geometry, and performance

## Installation

The Flow extension is part of the design system. Ensure you have the required peer dependencies:

```bash
npm install @xyflow/react
```

## Usage

### Basic Usage

```tsx
import { FlowCanvas, FlowProvider } from '@fabio.caffarello/react-design-system/extensions/flow';
import { useNodesState, useEdgesState } from '@xyflow/react';

function MyFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  return (
    <FlowProvider
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <FlowCanvas.Root>
        <FlowCanvas.Background />
        <FlowCanvas.Controls />
        <FlowCanvas.Minimap />
      </FlowCanvas.Root>
    </FlowProvider>
  );
}
```

### Alternative Import Paths

You can also import from the main extensions export:

```tsx
import { FlowCanvas, FlowProvider } from '@fabio.caffarello/react-design-system/extensions';
```

Or from the main package (with deprecation warning):

```tsx
import { FlowCanvas, FlowProvider } from '@fabio.caffarello/react-design-system';
```

## Components

### FlowProvider

Main provider that combines ReactFlowProvider with design system context. Supports both controlled and uncontrolled modes.

### FlowCanvas

Compound component with sub-components:
- `FlowCanvas.Root` - Main canvas (wraps ReactFlow)
- `FlowCanvas.Background` - Background pattern (dots, lines, cross)
- `FlowCanvas.Controls` - Zoom/pan controls
- `FlowCanvas.Minimap` - Minimap for navigation
- `FlowCanvas.Panel` - Custom panels for UI overlays

### Atoms

- **FlowHandle**: Connection points for nodes with design system styling
- **FlowNodeWrapper**: Styling wrapper for nodes with variants and sizes

### Molecules

- **CustomNode**: Default node component with design system integration
- **CustomEdge**: Default edge component with animations and labels
- **FlowNodeToolbar**: Toolbar for node actions
- **InputNode**: Node with only source handles
- **OutputNode**: Node with only target handles
- **SelectorNode**: Node with interactive controls
- **ResizableNode**: Node with resizing capabilities
- **FloatingEdge**: Edge that dynamically adjusts its path

## Hooks

- `useFlowStyles` - Access and manage CSS variables and theming
- `useFlowPerformance` - Monitor and optimize performance
- `useFlowEvents` - Subscribe to and emit Flow events
- `useFlowUtils` - Utility functions for geometry and helpers
- `useFlowSelection` - Advanced selection management
- `useFlowViewport` - Viewport management (zoom, pan, fit view)
- `useFlowState` - State management with React Flow hooks
- `useFlowActions` - Actions for zoom, pan, fit view
- `useNodeSelection` - Track selected nodes/edges
- `useFlowValidation` - Validate flow with rules
- `useAutoLayout` - Apply automatic layouts
- `useFlowVirtualization` - Viewport-based rendering for large flows

## Factories

- `FlowFactory` - Main factory for creating flows, nodes, and edges
- `NodeBuilder` - Fluent builder for creating nodes
- `EdgeBuilder` - Fluent builder for creating edges

## Registries

- `NodeTypeRegistry` - Registry for managing node types
- `EdgeTypeRegistry` - Registry for managing edge types
- `LayoutRegistry` - Registry for managing layout strategies
- `PluginRegistry` - Registry for managing Flow plugins

## Strategies

- `LayoutStrategyManager` - Manages layout algorithms (Dagre, ELK, Force)
- `EdgeRoutingStrategyManager` - Manages edge routing strategies
- `AnimationStrategyManager` - Manages animation strategies

## Customization

Nodes and edges can be customized through multiple layers:

1. **Variant and size props** - Quick styling
2. **Custom components** - Replace default components
3. **Render props** - Flexible content rendering
4. **Slots** - Direct content injection
5. **Theme overrides** - Advanced styling via CSS variables

## Theming

The Flow extension uses CSS variables for theming, integrated with the design system tokens:

```tsx
import { FlowStyleProvider } from '@fabio.caffarello/react-design-system/extensions/flow';

<FlowStyleProvider initialTheme="dark">
  {/* Your flow components */}
</FlowStyleProvider>
```

## Performance

The extension includes performance optimizations:

- Memoization of components
- Virtualization for large flows
- Lazy loading of node/edge types
- Performance monitoring hooks

## Migration from Old Structure

If you were using Flow components from the old structure:

**Before:**
```tsx
import { FlowCanvas } from '@fabio.caffarello/react-design-system';
```

**After:**
```tsx
import { FlowCanvas } from '@fabio.caffarello/react-design-system/extensions/flow';
```

The old import path will still work but will show a deprecation warning.

## Documentation

For more detailed documentation, see:
- [Flow.mdx](./organisms/Flow.mdx) - Complete component documentation
- [FlowPlayground.mdx](./organisms/FlowPlayground.mdx) - Playground guide
- Storybook stories in the `Extensions/Flow` section
