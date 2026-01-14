/**
 * Context Code Generator
 * 
 * Generates context providers with JSON data
 */

import type { FeatureContextData } from '../types';

/**
 * Generate context provider code
 */
export function generateContextProvider(contextData: FeatureContextData): string {
  const { providerName, data, config } = contextData;

  if (config?.enabled === false) {
    return `// ${providerName} is disabled`;
  }

  const dataString = JSON.stringify(data, null, 2);
  const mergeWithDefault = config?.mergeWithDefault === true;

  return `import { ${providerName} } from '@/ui/providers';

/**
 * ${providerName} Configuration
 */
export const ${providerName}Config = ${dataString};

/**
 * ${providerName} Wrapper
 */
export function ${providerName}Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <${providerName}${mergeWithDefault ? ' {...defaultConfig}' : ''} {...${providerName}Config}>
      {children}
    </${providerName}>
  );
}`;
}

/**
 * Generate context hook
 */
export function generateContextHook(providerName: string): string {
  const hookName = `use${providerName.replace('Provider', '')}`;

  return `import { ${hookName} } from '@/ui/providers';

/**
 * Hook to access ${providerName} context
 */
export function use${providerName.replace('Provider', '')}Context() {
  return ${hookName}();
}`;
}

/**
 * Generate all context providers for an app
 */
export function generateAllContextProviders(
  contexts: FeatureContextData[]
): string {
  const enabledContexts = contexts.filter((ctx) => ctx.config?.enabled !== false);

  if (enabledContexts.length === 0) {
    return '// No context providers configured';
  }

  const imports = new Set<string>();
  const providers: string[] = [];

  enabledContexts.forEach((ctx) => {
    imports.add(ctx.providerName);
    const dataString = JSON.stringify(ctx.data, null, 4);
    providers.push(`    <${ctx.providerName} {...${dataString}}>`);
  });

  const closingTags = enabledContexts
    .map((ctx) => `    </${ctx.providerName}>`)
    .reverse();

  return `import { ${Array.from(imports).join(', ')} } from '@/ui/providers';

/**
 * App Context Providers
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
${providers.join('\n')}
      {children}
${closingTags.join('\n')}
  );
}`;
}
