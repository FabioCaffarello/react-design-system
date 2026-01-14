/**
 * App Code Generator
 * 
 * Generates complete React application code
 */

import type { AppConfig, GeneratedApp } from '../types';
import { generateFeatureCode } from './FeatureCodeGenerator';
import { generateAllContextProviders } from './ContextCodeGenerator';

/**
 * Generate route code (if routes are defined)
 */
function generateRouteCode(appConfig: AppConfig): string | undefined {
  if (!appConfig.routes || appConfig.routes.length === 0) {
    return undefined;
  }

  const routeImports = appConfig.routes.map((route) => {
    const componentName = route.component.replace(/\s+/g, '');
    return `import { ${componentName} } from './features/${componentName}';`;
  });

  const routeElements = appConfig.routes.map((route) => {
    const componentName = route.component.replace(/\s+/g, '');
    const exact = route.exact !== false ? 'exact' : '';
    return `        <Route path="${route.path}" ${exact ? `exact ` : ''}element={<${componentName} />} />`;
  });

  return `import { BrowserRouter, Routes, Route } from 'react-router-dom';
${routeImports.join('\n')}

/**
 * App Routes
 */
export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
${routeElements.join('\n')}
      </Routes>
    </BrowserRouter>
  );
}`;
}

/**
 * Generate main App component
 */
function generateAppComponent(appConfig: AppConfig): string {
  const hasGlobalContexts = appConfig.globalContexts && appConfig.globalContexts.length > 0;
  const hasRoutes = appConfig.routes && appConfig.routes.length > 0;

  let imports = "import { AppProvider } from '@/ui/providers';\n";
  let content = '';

  if (hasGlobalContexts) {
    imports += "import { AppProviders } from './contexts/AppProviders';\n";
    content = `    <AppProviders>
      <AppProvider>
        ${hasRoutes ? '<AppRoutes />' : '<AppContent />'}
      </AppProvider>
    </AppProviders>`;
  } else {
    content = `    <AppProvider>
      ${hasRoutes ? '<AppRoutes />' : '<AppContent />'}
    </AppProvider>`;
  }

  if (!hasRoutes) {
    // Generate content from features
    const featureComponents = appConfig.features
      .map((f) => {
        const name = f.name.replace(/\s+/g, '');
        return `import { ${name} } from './features/${name}';`;
      })
      .join('\n');

    imports += featureComponents;
    imports += "\n\nfunction AppContent() {\n  return (\n    <>\n";
    appConfig.features.forEach((f) => {
      const name = f.name.replace(/\s+/g, '');
      imports += `      <${name} />\n`;
    });
    imports += '    </>\n  );\n}';
  } else {
    imports += "import { AppRoutes } from './routes';\n";
  }

  return `${imports}

/**
 * ${appConfig.name}
 * 
 * ${appConfig.description || 'Generated application'}
 */
export function App() {
  return (
${content}
  );
}

export default App;
`;
}

/**
 * Generate index file
 */
function generateIndexFile(appConfig: AppConfig): string {
  return `export { default as App } from './App';
export * from './App';
`;
}

/**
 * Generate package.json (optional)
 */
function generatePackageJson(appConfig: AppConfig): string {
  return JSON.stringify(
    {
      name: appConfig.name.toLowerCase().replace(/\s+/g, '-'),
      version: appConfig.metadata?.version || '1.0.0',
      description: appConfig.description,
      main: 'src/index.ts',
      dependencies: {
        react: '^18.0.0',
        'react-dom': '^18.0.0',
        'react-router-dom': '^6.0.0',
      },
    },
    null,
    2
  );
}

/**
 * Generate README
 */
function generateReadme(appConfig: AppConfig): string {
  return `# ${appConfig.name}

${appConfig.description || 'Generated application'}

## Features

${appConfig.features.map((f) => `- **${f.name}**: ${f.description || 'No description'}`).join('\n')}

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Structure

\`\`\`
src/
├── App.tsx              # Main application component
├── features/            # Feature components
${appConfig.features.map((f) => `│   └── ${f.name.replace(/\s+/g, '')}.tsx`).join('\n')}
${appConfig.globalContexts && appConfig.globalContexts.length > 0 ? '├── contexts/           # Context providers\n│   └── AppProviders.tsx\n' : ''}${appConfig.routes && appConfig.routes.length > 0 ? '└── routes.tsx          # Route configuration\n' : ''}
\`\`\`

## Generated

This application was generated using the App Builder tool.
${appConfig.metadata?.author ? `\nAuthor: ${appConfig.metadata.author}` : ''}
${appConfig.metadata?.createdAt ? `\nCreated: ${appConfig.metadata.createdAt}` : ''}
`;
}

/**
 * Generate complete app code
 */
export function generateAppCode(appConfig: AppConfig): GeneratedApp {
  // Generate feature files
  const featureFiles: Record<string, string> = {};
  appConfig.features.forEach((feature) => {
    const featureName = feature.name.replace(/\s+/g, '');
    featureFiles[featureName] = generateFeatureCode(feature);
  });

  // Generate context files
  const contextFiles: Record<string, string> = {};
  if (appConfig.globalContexts && appConfig.globalContexts.length > 0) {
    contextFiles['AppProviders'] = generateAllContextProviders(appConfig.globalContexts);
  }

  // Generate route file
  const routeFile = generateRouteCode(appConfig);

  // Generate main app file
  const mainFile = generateAppComponent(appConfig);

  // Generate index file
  const indexFile = generateIndexFile(appConfig);

  // Generate package.json
  const packageJson = generatePackageJson(appConfig);

  // Generate README
  const readme = generateReadme(appConfig);

  return {
    mainFile,
    featureFiles,
    contextFiles,
    routeFile,
    indexFile,
    packageJson,
    readme,
  };
}
