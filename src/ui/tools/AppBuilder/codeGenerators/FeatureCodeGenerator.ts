/**
 * Feature Code Generator
 * 
 * Generates React code for individual features
 */

import type { FeatureConfig, FeatureComponent } from '../types';
import { ComponentRegistry } from '../../../builders/ComponentRegistry';

/**
 * Generate import path for component
 */
function getComponentImportPath(componentName: string, category: FeatureComponent['type']): string {
  const categoryPaths: Record<FeatureComponent['type'], string> = {
    atom: '@/ui/atoms',
    molecule: '@/ui/molecules',
    organism: '@/ui/organisms',
    template: '@/ui/templates',
    pattern: '@/ui/patterns',
    layout: '@/ui/layouts',
  };

  return categoryPaths[category] || '@/ui/atoms';
}

/**
 * Generate component JSX from feature component
 */
function generateComponentJSX(
  component: FeatureComponent,
  indent: number = 0
): string {
  const indentStr = '  '.repeat(indent);
  const metadata = ComponentRegistry.get(component.name);
  
  // Validate component exists in registry
  if (!metadata) {
    console.warn(`Component ${component.name} not found in registry. Generating placeholder.`);
    return `${indentStr}<!-- Component ${component.name} not found in registry -->\n${indentStr}<div>Component: ${component.name}</div>`;
  }
  
  const importPath = getComponentImportPath(component.name, component.type);

  // Build props string
  const propsEntries = Object.entries(component.props || {});
  const propsString = propsEntries
    .map(([key, value]) => {
      if (typeof value === 'string') {
        return `${key}="${value}"`;
      } else if (typeof value === 'boolean') {
        return value ? key : `${key}={false}`;
      } else if (typeof value === 'number') {
        return `${key}={${value}}`;
      } else if (value === null) {
        return `${key}={null}`;
      } else {
        return `${key}={${JSON.stringify(value)}}`;
      }
    })
    .join(' ');

  const componentTag = component.name;
  const hasChildren = component.children && component.children.length > 0;

  if (hasChildren) {
    const childrenJSX = component.children!
      .map((child) => generateComponentJSX(child, indent + 1))
      .join('\n');

    return `${indentStr}<${componentTag}${propsString ? ` ${propsString}` : ''}>\n${childrenJSX}\n${indentStr}</${componentTag}>`;
  } else {
    return `${indentStr}<${componentTag}${propsString ? ` ${propsString}` : ''} />`;
  }
}

/**
 * Generate layout wrapper JSX
 */
function generateLayoutJSX(
  layout: FeatureConfig['layout'],
  children: string
): string {
  const { type, config } = layout;

  if (type === 'container') {
    const maxWidth = config.maxWidth || 'xl';
    const padding = config.padding || 'base';
    return `<Container maxWidth="${maxWidth}" paddingX="${padding}" paddingY="${padding}">\n${children}\n</Container>`;
  }

  if (type === 'stack') {
    const spacing = config.spacing || 'md';
    return `<Stack spacing="${spacing}">\n${children}\n</Stack>`;
  }

  if (type === 'flex') {
    const direction = config.direction || 'row';
    const justify = config.justify || 'start';
    const align = config.align || 'start';
    const wrap = config.wrap || 'wrap';
    return `<div style={{ display: 'flex', flexDirection: '${direction}', justifyContent: '${justify}', alignItems: '${align}', flexWrap: '${wrap}' }}>\n${children}\n</div>`;
  }

  if (type === 'grid') {
    const columns = config.columns || 3;
    const rows = config.rows || 'auto';
    const gap = config.gap || 'md';
    return `<div style={{ display: 'grid', gridTemplateColumns: '${columns}', gridTemplateRows: '${rows}', gap: '${gap}' }}>\n${children}\n</div>`;
  }

  // Default: just return children
  return children;
}

/**
 * Generate imports for feature
 */
function generateImports(feature: FeatureConfig): string {
  const imports = new Map<string, Set<string>>();

  function collectImports(component: FeatureComponent) {
    const importPath = getComponentImportPath(component.name, component.type);
    if (!imports.has(importPath)) {
      imports.set(importPath, new Set());
    }
    imports.get(importPath)!.add(component.name);

    if (component.children) {
      component.children.forEach(collectImports);
    }
  }

  feature.components.forEach(collectImports);

  // Add layout imports if needed
  if (feature.layout.type === 'container' || feature.layout.type === 'stack') {
    const layoutPath = '@/ui/layouts';
    if (!imports.has(layoutPath)) {
      imports.set(layoutPath, new Set());
    }
    if (feature.layout.type === 'container') {
      imports.get(layoutPath)!.add('Container');
    }
    if (feature.layout.type === 'stack') {
      imports.get(layoutPath)!.add('Stack');
    }
  }

  // Generate import statements
  const importStatements: string[] = [];
  for (const [path, components] of imports.entries()) {
    const componentList = Array.from(components).sort().join(', ');
    importStatements.push(`import { ${componentList} } from '${path}';`);
  }

  return importStatements.join('\n');
}

/**
 * Generate feature code
 */
export function generateFeatureCode(feature: FeatureConfig): string {
  const componentImports = generateImports(feature);
  const featureName = feature.name.replace(/\s+/g, '');

  // Generate components JSX
  const componentsJSX = feature.components
    .map((component) => generateComponentJSX(component, 2))
    .join('\n');

  // Wrap in layout
  const wrappedJSX = generateLayoutJSX(feature.layout, componentsJSX);

  // Generate context providers if any
  let contextProviders = '';
  let providerImports = '';
  
  if (feature.contexts && feature.contexts.length > 0) {
    const enabledContexts = feature.contexts.filter((ctx) => ctx.config?.enabled !== false);
    if (enabledContexts.length > 0) {
      const providerNames = new Set<string>();
      enabledContexts.forEach((ctx) => providerNames.add(ctx.providerName));

      providerImports = Array.from(providerNames)
        .map((p) => `import { ${p} } from '@/ui/providers';`)
        .join('\n');

      const providers = enabledContexts
        .map((ctx) => {
          const dataString = JSON.stringify(ctx.data, null, 6);
          return `      <${ctx.providerName} config={${dataString}}>`;
        })
        .join('\n');

      const closingTags = enabledContexts
        .map((ctx) => `      </${ctx.providerName}>`)
        .reverse()
        .join('\n');

      contextProviders = `${providers}\n        ${wrappedJSX}\n${closingTags}`;
    } else {
      contextProviders = `      ${wrappedJSX}`;
    }
  } else {
    contextProviders = `      ${wrappedJSX}`;
  }

  // Combine all imports
  const allImports = [componentImports, providerImports]
    .filter(Boolean)
    .join('\n');

  return `${allImports}

/**
 * ${feature.name}
 * 
 * ${feature.description || 'Generated feature'}
 */
export function ${featureName}() {
  return (
${contextProviders}
  );
}

export default ${featureName};
`;
}
