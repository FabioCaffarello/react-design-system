#!/usr/bin/env tsx
/**
 * Test Next.js Build Compatibility
 * 
 * This script validates that the design system can be used in a Next.js application
 * without causing build errors during SSR/prerendering.
 * 
 * It creates a minimal Next.js app, imports AppProvider, and attempts to build it.
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { join } from 'path';

const TEST_DIR = join(process.cwd(), '.test-nextjs');
const NEXTJS_APP_DIR = join(TEST_DIR, 'nextjs-app');

interface TestResult {
  success: boolean;
  error?: string;
  output?: string;
}

function log(message: string) {
  console.log(`[test-nextjs-build] ${message}`);
}

function cleanup() {
  if (existsSync(TEST_DIR)) {
    log('Cleaning up test directory...');
    rmSync(TEST_DIR, { recursive: true, force: true });
  }
}

function createNextJsApp(): void {
  log('Creating minimal Next.js app...');
  
  mkdirSync(NEXTJS_APP_DIR, { recursive: true });
  
  // package.json
  const packageJson = {
    name: 'nextjs-test-app',
    version: '1.0.0',
    private: true,
    scripts: {
      build: 'next build --turbo',
      dev: 'next dev --turbo',
    },
    dependencies: {
      next: '^15.5.9',
      react: '^19.0.3',
      'react-dom': '^19.0.3',
      '@fabio.caffarello/react-design-system': `file:${process.cwd()}`,
    },
  };
  
  writeFileSync(
    join(NEXTJS_APP_DIR, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  
  // next.config.js
  const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  // Test SSR compatibility
  output: 'standalone',
  // Turbopack configuration (Next.js 15+)
  // Turbopack handles module initialization and bundling differently than webpack
  // This may resolve initialization order issues
  turbopack: {
    // Turbopack-specific configuration
    resolveAlias: {
      // Ensure providers are resolved correctly
    },
  },
};

module.exports = nextConfig;
`;
  
  writeFileSync(join(NEXTJS_APP_DIR, 'next.config.js'), nextConfig);
  
  // tsconfig.json
  const tsconfig = {
    compilerOptions: {
      target: 'ES2017',
      lib: ['dom', 'dom.iterable', 'esnext'],
      allowJs: true,
      skipLibCheck: true,
      strict: true,
      forceConsistentCasingInFileNames: true,
      noEmit: true,
      esModuleInterop: true,
      module: 'esnext',
      moduleResolution: 'bundler',
      resolveJsonModule: true,
      isolatedModules: true,
      jsx: 'preserve',
      incremental: true,
      plugins: [
        {
          name: 'next',
        },
      ],
      paths: {
        '@/*': ['./src/*'],
      },
    },
    include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
    exclude: ['node_modules'],
  };
  
  writeFileSync(
    join(NEXTJS_APP_DIR, 'tsconfig.json'),
    JSON.stringify(tsconfig, null, 2)
  );
  
  // app/layout.tsx
  mkdirSync(join(NEXTJS_APP_DIR, 'app'), { recursive: true });
  const layout = `import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
`;
  
  writeFileSync(join(NEXTJS_APP_DIR, 'app', 'layout.tsx'), layout);
  
  // app/providers.tsx (Client Component)
  const providers = `'use client';

import { AppProvider } from '@fabio.caffarello/react-design-system';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider
      config={{
        theme: { defaultTheme: 'light' },
        config: { config: { features: { debug: false } } },
        providers: {
          theme: true,
          config: true,
          toast: true,
          dialog: true,
        },
      }}
    >
      {children}
    </AppProvider>
  );
}
`;
  
  writeFileSync(join(NEXTJS_APP_DIR, 'app', 'providers.tsx'), providers);
  
  // app/page.tsx
  const page = `export default function HomePage() {
  return (
    <div>
      <h1>Next.js Build Test</h1>
      <p>This page tests SSR/prerendering compatibility.</p>
    </div>
  );
}
`;
  
  writeFileSync(join(NEXTJS_APP_DIR, 'app', 'page.tsx'), page);
  
  // app/test/page.tsx (client component test)
  mkdirSync(join(NEXTJS_APP_DIR, 'app', 'test'), { recursive: true });
  const testPage = `'use client';

import { AppProvider } from '@fabio.caffarello/react-design-system';

export default function TestPage() {
  return (
    <AppProvider
      config={{
        theme: { defaultTheme: 'dark' },
        config: { config: { features: { debug: true } } },
      }}
    >
      <div>
        <h1>Client Component Test</h1>
        <p>This page tests client-side rendering.</p>
      </div>
    </AppProvider>
  );
}
`;
  
  writeFileSync(join(NEXTJS_APP_DIR, 'app', 'test', 'page.tsx'), testPage);
}

function testBuild(): TestResult {
  try {
    log('Installing dependencies...');
    execSync('npm install', {
      cwd: NEXTJS_APP_DIR,
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'production' },
    });
    
    log('Building Next.js app...');
    const output = execSync('npm run build', {
      cwd: NEXTJS_APP_DIR,
      stdio: 'pipe',
      encoding: 'utf-8',
      env: { ...process.env, NODE_ENV: 'production' },
    });
    
    return {
      success: true,
      output: output.toString(),
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const execError = error as { stdout?: Buffer; stderr?: Buffer };
    return {
      success: false,
      error: errorMessage,
      output: execError.stdout?.toString() || execError.stderr?.toString(),
    };
  }
}

function main() {
  log('Starting Next.js build compatibility test...');
  
  // Cleanup previous test
  cleanup();
  
  try {
    // Create test app
    createNextJsApp();
    
    // Test build
    const result = testBuild();
    
    if (result.success) {
      log('✅ Next.js build test PASSED');
      log('The design system is compatible with Next.js SSR/prerendering.');
      cleanup();
      process.exit(0);
    } else {
      log('❌ Next.js build test FAILED');
      log(`Error: ${result.error || 'Unknown error'}`);
      if (result.output) {
        log('Build output:');
        console.log(result.output);
      }
      log(`\nTest app location: ${NEXTJS_APP_DIR}`);
      log('You can inspect the test app to debug the issue.');
      process.exit(1);
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    log('❌ Test setup failed');
    log(`Error: ${errorMessage}`);
    cleanup();
    process.exit(1);
  }
}

// Run main if this is the entry point
main();
