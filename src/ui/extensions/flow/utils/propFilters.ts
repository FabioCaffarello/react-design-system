/**
 * Prop Filters for React Flow
 * 
 * Helper functions to filter out React Flow internal props
 * that should not be passed to DOM elements.
 */

/**
 * List of React Flow internal props that should not be passed to DOM
 */
const REACT_FLOW_INTERNAL_PROPS = [
  'sourceX',
  'sourceY',
  'targetX',
  'targetY',
  'sourcePosition',
  'targetPosition',
  'sourceHandleId',
  'targetHandleId',
  'pathOptions',
  'sourceHandle',
  'targetHandle',
  'xPos',
  'yPos',
  'width',
  'height',
  'dragging',
  'selected',
  'zIndex',
  'measured',
  'internals',
] as const;

/**
 * List of boolean attributes that should be converted to strings or removed
 */
const BOOLEAN_ATTRIBUTES = [
  'selectable',
  'deletable',
  'connectable',
  'focusable',
  'hidden',
] as const;

/**
 * Filters out React Flow internal props from an object
 * 
 * @param props - Props object that may contain React Flow internal props
 * @returns New object without React Flow internal props
 */
export function filterReactFlowProps<T extends Record<string, unknown>>(
  props: T
): Omit<T, typeof REACT_FLOW_INTERNAL_PROPS[number]> {
  const filtered = { ...props };
  
  REACT_FLOW_INTERNAL_PROPS.forEach((prop) => {
    if (prop in filtered) {
      delete filtered[prop];
    }
  });
  
  return filtered as Omit<T, typeof REACT_FLOW_INTERNAL_PROPS[number]>;
}

/**
 * Filters out boolean attributes that should not be passed to DOM
 * 
 * @param props - Props object that may contain boolean attributes
 * @returns New object without problematic boolean attributes
 */
export function filterBooleanAttributes<T extends Record<string, unknown>>(
  props: T
): Omit<T, typeof BOOLEAN_ATTRIBUTES[number]> {
  const filtered = { ...props };
  
  BOOLEAN_ATTRIBUTES.forEach((attr) => {
    if (attr in filtered) {
      delete filtered[attr];
    }
  });
  
  return filtered as Omit<T, typeof BOOLEAN_ATTRIBUTES[number]>;
}

/**
 * Filters out both React Flow props and boolean attributes
 * 
 * @param props - Props object to filter
 * @returns New object without problematic props
 */
export function filterAllProps<T extends Record<string, unknown>>(
  props: T
): Omit<T, typeof REACT_FLOW_INTERNAL_PROPS[number] | typeof BOOLEAN_ATTRIBUTES[number]> {
  return filterBooleanAttributes(filterReactFlowProps(props));
}
