/**
 * Code Generator for Flow Playground
 * 
 * Generates React code from playground state
 */

import type { Node, Edge } from '@xyflow/react';
import type { FlowNodeData, FlowEdgeData } from '../organisms/FlowTypes';
import type { ReactFlowConfig, BackgroundConfig } from '../types/playgroundTypes';

export interface CodeGenerationOptions {
  componentName?: string;
  format?: 'tsx' | 'jsx';
  includeComments?: boolean;
}

/**
 * Generate React code from playground state
 */
export function generateReactCode(
  nodes: Node<FlowNodeData>[],
  edges: Edge<FlowEdgeData>[],
  reactFlowConfig: ReactFlowConfig,
  backgroundConfig: BackgroundConfig,
  theme: 'light' | 'dark',
  options: CodeGenerationOptions = {}
): string {
  const {
    componentName = 'MyFlow',
    format = 'tsx',
    includeComments = true,
  } = options;

  const isTS = format === 'tsx';
  const importType = isTS ? 'type ' : '';
  
  // Detect node types used
  const nodeTypesUsed = new Set(nodes.map(n => n.type || 'default'));
  const edgeTypesUsed = new Set(edges.map(e => e.type || 'default'));
  
  // Generate imports for node types
  const nodeTypeImports: string[] = [];
  if (nodeTypesUsed.has('input')) nodeTypeImports.push('InputNode');
  if (nodeTypesUsed.has('output')) nodeTypeImports.push('OutputNode');
  if (nodeTypesUsed.has('selector')) nodeTypeImports.push('SelectorNode');
  if (nodeTypesUsed.has('resizable')) nodeTypeImports.push('ResizableNode');
  if (nodeTypesUsed.has('default') || nodeTypesUsed.size === 0) nodeTypeImports.push('CustomNode');
  
  // Generate imports for edge types
  const edgeTypeImports: string[] = [];
  if (edgeTypesUsed.has('floating')) edgeTypeImports.push('FloatingEdge');
  if (edgeTypesUsed.has('default') || edgeTypesUsed.size === 0) edgeTypeImports.push('CustomEdge');
  
  // Generate imports
  const imports = [
    `import { FlowProvider, FlowCanvas } from '@fabio.caffarello/react-design-system';`,
    nodeTypeImports.length > 0 ? `import { ${nodeTypeImports.join(', ')} } from '@fabio.caffarello/react-design-system/molecules';` : '',
    edgeTypeImports.length > 0 ? `import { ${edgeTypeImports.join(', ')} } from '@fabio.caffarello/react-design-system/molecules';` : '',
    `import { useNodesState, useEdgesState, addEdge${isTS ? ', type Node, type Edge, type Connection' : ''} } from '@xyflow/react';`,
    `import { useCallback } from 'react';`,
  ].filter(Boolean).join('\n');

  // Generate nodes array
  const nodesString = JSON.stringify(nodes, null, 2);
  
  // Generate edges array
  const edgesString = JSON.stringify(edges, null, 2);

  // Generate ReactFlow props
  const reactFlowProps = generateReactFlowProps(reactFlowConfig);

  // Generate nodeTypes object
  const nodeTypesEntries: string[] = [];
  nodeTypesUsed.forEach(type => {
    let componentName = 'CustomNode';
    if (type === 'input') componentName = 'InputNode';
    else if (type === 'output') componentName = 'OutputNode';
    else if (type === 'selector') componentName = 'SelectorNode';
    else if (type === 'resizable') componentName = 'ResizableNode';
    nodeTypesEntries.push(`  ${type}: ${componentName},`);
  });
  
  // Generate edgeTypes object
  const edgeTypesEntries: string[] = [];
  edgeTypesUsed.forEach(type => {
    const componentName = type === 'floating' ? 'FloatingEdge' : 'CustomEdge';
    edgeTypesEntries.push(`  ${type}: ${componentName},`);
  });
  
  const nodeTypesString = nodeTypesEntries.length > 0
    ? `const nodeTypes = {\n${nodeTypesEntries.join('\n')}\n};`
    : '';
  const edgeTypesString = edgeTypesEntries.length > 0
    ? `const edgeTypes = {\n${edgeTypesEntries.join('\n')}\n};`
    : '';
  
  // Generate component with proper formatting
  const component = `export ${isTS ? 'function' : 'function'} ${componentName}() {
  const [nodes, setNodes, onNodesChange] = useNodesState${isTS ? '<Node<FlowNodeData>>' : ''}(${nodesString});
  const [edges, setEdges, onEdgesChange] = useEdgesState${isTS ? '<Edge<FlowEdgeData>>' : ''}(${edgesString});

  const onConnect = useCallback((${isTS ? 'params: Connection' : 'params'}) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

${nodeTypesString}
${edgeTypesString ? `${edgeTypesString}\n` : ''}
  return (
    <div style={{ width: '100%', height: '600px' }}>
      <FlowProvider nodes={nodes} edges={edges} theme="${theme}">
        <FlowCanvas.Root
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}${reactFlowProps ? '\n' + reactFlowProps : ''}${nodeTypesString ? '\n          nodeTypes={nodeTypes}' : ''}${edgeTypesString ? '\n          edgeTypes={edgeTypes}' : ''}
        >
${backgroundConfig.show ? `          <FlowCanvas.Background variant="${backgroundConfig.variant}" size={${backgroundConfig.size}} />\n` : ''}          <FlowCanvas.Controls />
          <FlowCanvas.Minimap />
        </FlowCanvas.Root>
      </FlowProvider>
    </div>
  );
}`;

  // Add type imports if TypeScript
  const typeImports = isTS ? `import ${importType}{ FlowNodeData, FlowEdgeData } from '@fabio.caffarello/react-design-system';` : '';

  const comments = includeComments ? `/**
 * Generated Flow Component
 * 
 * This component was generated from the Flow Playground.
 * You can customize it further as needed.
 */\n\n` : '';

  return `${comments}${imports}
${typeImports ? `${typeImports}\n` : ''}${component}`;
}

/**
 * Generate ReactFlow props string
 */
function generateReactFlowProps(config: ReactFlowConfig): string {
  const props: string[] = [];
  
  if (config.panOnDrag !== undefined) {
    if (typeof config.panOnDrag === 'boolean') {
      props.push(`          panOnDrag={${config.panOnDrag}}`);
    } else {
      props.push(`          panOnDrag={[${config.panOnDrag.join(', ')}]}`);
    }
  }
  
  if (config.panOnScroll !== undefined) {
    props.push(`          panOnScroll={${config.panOnScroll}}`);
  }
  
  if (config.zoomOnScroll !== undefined) {
    props.push(`          zoomOnScroll={${config.zoomOnScroll}}`);
  }
  
  if (config.zoomOnPinch !== undefined) {
    props.push(`          zoomOnPinch={${config.zoomOnPinch}}`);
  }
  
  if (config.zoomOnDoubleClick !== undefined) {
    props.push(`          zoomOnDoubleClick={${config.zoomOnDoubleClick}}`);
  }
  
  if (config.selectOnClick !== undefined) {
    props.push(`          selectOnClick={${config.selectOnClick}}`);
  }
  
  if (config.nodesDraggable !== undefined) {
    props.push(`          nodesDraggable={${config.nodesDraggable}}`);
  }
  
  if (config.nodesConnectable !== undefined) {
    props.push(`          nodesConnectable={${config.nodesConnectable}}`);
  }
  
  if (config.elementsSelectable !== undefined) {
    props.push(`          elementsSelectable={${config.elementsSelectable}}`);
  }
  
  if (config.minZoom !== undefined) {
    props.push(`          minZoom={${config.minZoom}}`);
  }
  
  if (config.maxZoom !== undefined) {
    props.push(`          maxZoom={${config.maxZoom}}`);
  }
  
  if (config.defaultZoom !== undefined) {
    props.push(`          defaultZoom={${config.defaultZoom}}`);
  }
  
  if (config.snapToGrid !== undefined) {
    props.push(`          snapToGrid={${config.snapToGrid}}`);
  }
  
  if (config.snapGrid) {
    props.push(`          snapGrid={[${config.snapGrid[0]}, ${config.snapGrid[1]}]}`);
  }
  
  if (config.deleteKeyCode !== undefined && config.deleteKeyCode !== null) {
    props.push(`          deleteKeyCode="${config.deleteKeyCode}"`);
  }
  
  if (config.multiSelectKeyCode !== undefined && config.multiSelectKeyCode !== null) {
    props.push(`          multiSelectKeyCode="${config.multiSelectKeyCode}"`);
  }
  
  if (config.selectionOnDrag !== undefined) {
    props.push(`          selectionOnDrag={${config.selectionOnDrag}}`);
  }
  
  if (config.fitView !== undefined) {
    props.push(`          fitView={${config.fitView}}`);
  }
  
  if (config.nodeOrigin && Array.isArray(config.nodeOrigin)) {
    props.push(`          nodeOrigin={[${config.nodeOrigin[0]}, ${config.nodeOrigin[1]}]}`);
  }
  
  if (config.proOptions !== undefined) {
    const proOptionsStr = JSON.stringify(config.proOptions);
    props.push(`          proOptions={${proOptionsStr}}`);
  }
  
  if (config.connectionRadius !== undefined) {
    props.push(`          connectionRadius={${config.connectionRadius}}`);
  }
  
  if (config.preventScrolling !== undefined) {
    props.push(`          preventScrolling={${config.preventScrolling}}`);
  }
  
  if (config.onlyRenderVisibleElements !== undefined) {
    props.push(`          onlyRenderVisibleElements={${config.onlyRenderVisibleElements}}`);
  }
  
  if (config.defaultViewport !== undefined) {
    const viewportStr = JSON.stringify(config.defaultViewport);
    props.push(`          defaultViewport={${viewportStr}}`);
  }
  
  if (config.fitViewOptions !== undefined) {
    const fitViewOptionsStr = JSON.stringify(config.fitViewOptions);
    props.push(`          fitViewOptions={${fitViewOptionsStr}}`);
  }
  
  return props.length > 0 ? props.join('\n') : '';
}

/**
 * Format code with basic formatting
 */
export function formatCode(code: string): string {
  // Basic formatting - improve indentation and spacing
  let formatted = code
    .replace(/\n{3,}/g, '\n\n') // Remove multiple empty lines
    .replace(/\t/g, '  ') // Replace tabs with 2 spaces
    .trim();
  
  // Ensure consistent spacing around braces
  formatted = formatted.replace(/\{\s+/g, '{ ');
  formatted = formatted.replace(/\s+\}/g, ' }');
  
  // Ensure proper spacing in JSX
  formatted = formatted.replace(/<\s+/g, '<');
  formatted = formatted.replace(/\s+>/g, '>');
  
  return formatted;
}

/**
 * Download code as file
 */
export function downloadCode(code: string, filename: string = 'flow-component.tsx'): void {
  const blob = new Blob([code], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
