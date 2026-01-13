/**
 * Flow Types
 * 
 * Type definitions that extend React Flow's native types.
 * These types add design system specific fields while maintaining
 * compatibility with React Flow's API.
 */

import type {
  Node,
  Edge,
  NodeData,
  EdgeData,
  NodeTypes,
  EdgeTypes,
  ReactFlowInstance,
  Connection,
  ReactFlowJsonObject,
} from '@xyflow/react';
import type { ReactNode } from 'react';

/**
 * Node Hierarchy Information
 */
export interface NodeHierarchy {
  level: number;
  parentId?: string;
  childrenIds?: string[];
}

/**
 * Node Relationships
 */
export interface NodeRelationships {
  incoming?: string[];
  outgoing?: string[];
}

/**
 * Extended NodeData with design system specific fields
 */
export interface FlowNodeData extends NodeData {
  // Basic fields
  label?: string;
  type?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  icon?: ReactNode;
  description?: string;
  
  // Metadata
  tags?: string[];
  category?: string;
  createdAt?: number;
  updatedAt?: number;
  version?: number;
  author?: string;
  
  // Semantic fields
  status?: 'draft' | 'active' | 'archived' | 'deprecated';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  hierarchy?: NodeHierarchy;
  relationships?: NodeRelationships;
  
  // Custom fields
  [key: string]: unknown;
}

/**
 * Extended EdgeData with design system specific fields
 */
export interface FlowEdgeData extends EdgeData {
  // Basic fields
  label?: string;
  type?: string;
  animated?: boolean;
  style?: React.CSSProperties;
  
  // Metadata
  tags?: string[];
  category?: string;
  createdAt?: number;
  updatedAt?: number;
  version?: number;
  
  // Semantic fields
  relationship?: 'dependency' | 'association' | 'composition' | 'aggregation' | 'generalization';
  weight?: number;
  bidirectional?: boolean;
  
  // Custom fields
  [key: string]: unknown;
}

/**
 * Type aliases for convenience
 */
export type FlowNode<T extends FlowNodeData = FlowNodeData> = Node<T>;
export type FlowEdge<T extends FlowEdgeData = FlowEdgeData> = Edge<T>;

/**
 * Type aliases for nodeTypes and edgeTypes
 */
export type FlowNodeTypes = NodeTypes;
export type FlowEdgeTypes = EdgeTypes;

/**
 * Extended ReactFlowInstance with additional design system methods
 */
export interface FlowInstance extends ReactFlowInstance {
  validate?: () => ValidationResult[];
  exportToJSON?: () => ReactFlowJsonObject;
  importFromJSON?: (json: ReactFlowJsonObject) => void;
}

/**
 * Validation Result
 */
export interface ValidationResult {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  nodeId?: string;
  edgeId?: string;
}

/**
 * Validation Rule
 */
export interface ValidationRule {
  id: string;
  validate: (nodes: Node[], edges: Edge[]) => ValidationResult | null;
  message: string;
}

/**
 * Connection Rule for validating connections
 */
export interface ConnectionRule {
  sourceType: string | string[];
  targetType: string | string[];
  allowed: boolean;
  maxConnections?: number;
  customValidator?: (connection: Connection, nodes: Node[], edges: Edge[]) => boolean;
}

/**
 * Layout Strategy Name
 */
export type LayoutStrategyName = 'dagre' | 'elk' | 'force';

/**
 * Layout Options
 */
export interface LayoutOptions {
  direction?: 'TB' | 'BT' | 'LR' | 'RL';
  nodeWidth?: number;
  nodeHeight?: number;
  spacing?: number;
}

/**
 * Layout Result
 */
export interface LayoutResult {
  nodes: Node[];
  edges: Edge[];
}

/**
 * Node Customization (5 layers of customization)
 */
export interface NodeCustomization {
  // Layer 1: Base styling
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  // Layer 2: Custom components
  HeaderComponent?: React.ComponentType<NodeHeaderProps>;
  BodyComponent?: React.ComponentType<NodeBodyProps>;
  FooterComponent?: React.ComponentType<NodeFooterProps>;
  ToolbarComponent?: React.ComponentType<NodeToolbarProps>;
  
  // Layer 3: Render props
  renderHeader?: (data: NodeData) => ReactNode;
  renderBody?: (data: NodeData) => ReactNode;
  renderFooter?: (data: NodeData) => ReactNode;
  
  // Layer 4: Slots
  headerSlot?: ReactNode;
  bodySlot?: ReactNode;
  footerSlot?: ReactNode;
  
  // Layer 5: Advanced styling
  className?: string;
  style?: React.CSSProperties;
  themeOverrides?: Record<string, unknown>;
}

/**
 * Edge Customization
 */
export interface EdgeCustomization {
  // Edge type
  type?: 'default' | 'smoothstep' | 'bezier' | 'straight' | 'step';
  
  // Styling
  animated?: boolean;
  style?: React.CSSProperties;
  className?: string;
  
  // Labels
  label?: string;
  labelStyle?: React.CSSProperties;
  labelComponent?: React.ComponentType<EdgeLabelProps>;
  renderLabel?: (edge: Edge) => ReactNode;
  
  // Markers
  markerStart?: string;
  markerEnd?: string;
  
  // Interactivity
  selectable?: boolean;
  deletable?: boolean;
}

/**
 * Props for node header components
 */
export interface NodeHeaderProps {
  data: NodeData;
  selected?: boolean;
}

/**
 * Props for node body components
 */
export interface NodeBodyProps {
  data: NodeData;
  selected?: boolean;
}

/**
 * Props for node footer components
 */
export interface NodeFooterProps {
  data: NodeData;
  selected?: boolean;
}

/**
 * Props for node toolbar components
 */
export interface NodeToolbarProps {
  nodeId: string;
  data: NodeData;
}

/**
 * Props for edge label components
 */
export interface EdgeLabelProps {
  edge: Edge;
  label?: string;
}
