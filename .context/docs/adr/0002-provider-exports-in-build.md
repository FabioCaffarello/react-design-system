# ADR-0002: Provider Exports in Production Build

**Status:** Proposed  
**Date:** 2026-01-19  
**Deciders:** Design System Team  
**Tags:** build, exports, providers, bundling

## Context

The `AppProvider` and other providers (`ConfigProvider`, `ThemeProvider`) are exported from `src/ui/index.ts` and have proper TypeScript declarations, but they are **not included** in the production build (`dist/index.js`).

### Current State

**Source exports (`src/ui/index.ts`):**
```typescript
export * from "./providers";  // ← Includes AppProvider
```

**Provider exports (`src/ui/providers/index.ts`):**
```typescript
export { AppProvider, useApp, type AppProviderProps, type AppProviderConfig } from './AppProvider';
export { ConfigProvider, useConfig, ... } from './ConfigProvider';
export { ThemeProvider, useTheme, ... } from './ThemeProvider';
```

**Type definitions exist:**
- ✅ `dist/ui/providers/index.d.ts` - Contains all provider exports
- ✅ `dist/ui/providers/AppProvider.d.ts` - Contains AppProvider definition

**Production build:**
- ❌ `dist/index.js` - Does NOT contain AppProvider
- ❌ Consumers cannot import AppProvider in production

### Impact

**Error observed:**
```
Attempted import error: 'AppProvider' is not exported from '@fabio.caffarello/react-design-system' (imported as 'AppProvider').
```

**Workaround applied by consumers:**
- Created temporary `Providers` component
- Disabled AppProvider functionality
- Lost theme, config, toast, and dialog features

### Root Cause Analysis

**Vite build configuration:**
```typescript
// vite.config.ts
build: {
  lib: {
    entry: {
      index: "src/ui/index.ts",  // ← Should include providers
      // ...
    }
  }
}
```

**Possible causes:**
1. **Tree-shaking too aggressive**: Vite/Rollup may be removing unused exports
2. **Circular dependencies**: Providers may have circular dependencies that break bundling
3. **External dependencies**: Providers may depend on external packages not properly configured
4. **Entry point resolution**: The entry point may not be resolving all exports correctly

## Decision

We will **ensure all exports from `src/ui/index.ts` are included in the production build** by:

1. **Verifying build includes all exports**: Add validation to ensure all named exports are present
2. **Fixing bundling configuration**: Update Vite config to prevent aggressive tree-shaking of exports
3. **Adding explicit exports**: If needed, explicitly list all exports in the build entry
4. **Testing build output**: Verify AppProvider and all providers are accessible

### Implementation Strategy

#### Step 1: Investigate Build Output

1. **Analyze current build**:
   ```bash
   # Check what's actually exported
   node -e "const pkg = require('./dist/index.js'); console.log(Object.keys(pkg))"
   ```

2. **Compare source vs build**:
   - List all exports from `src/ui/index.ts`
   - List all exports from `dist/index.js`
   - Identify missing exports

#### Step 2: Fix Vite Configuration

**Option A: Preserve all exports (Recommended)**
```typescript
// vite.config.ts
build: {
  lib: {
    entry: "src/ui/index.ts",
    formats: ["es", "cjs"],
  },
  rollupOptions: {
    external: ["react", "react-dom"],
    output: {
      // Preserve all exports
      exports: "named",
      // Don't tree-shake exports
      preserveModules: false,
    }
  }
}
```

**Option B: Explicit export preservation**
```typescript
// vite.config.ts
rollupOptions: {
  output: {
    // Explicitly preserve specific exports
    preserveModules: false,
    // Ensure all named exports are included
    exports: "named",
  },
  // Prevent tree-shaking of exports
  treeshake: {
    moduleSideEffects: true,
  }
}
```

#### Step 3: Add Build Validation

Create validation script:
```javascript
// scripts/validate-build-exports.js
import { readFileSync } from 'fs';
import { parse } from '@babel/parser';

// Read source exports
const sourceExports = extractExports('src/ui/index.ts');

// Read build exports
const buildExports = extractExports('dist/index.js');

// Compare and fail if missing
const missing = sourceExports.filter(e => !buildExports.includes(e));
if (missing.length > 0) {
  console.error('Missing exports in build:', missing);
  process.exit(1);
}
```

#### Step 4: Verify Provider Dependencies

Check for issues that might prevent bundling:

1. **Circular dependencies**:
   ```bash
   npx madge --circular src/ui/providers
   ```

2. **External dependencies**:
   - Verify all provider dependencies are properly externalized
   - Check for missing peer dependencies

3. **Import paths**:
   - Ensure all imports use correct paths
   - Verify relative imports resolve correctly

## Consequences

### Positive

- ✅ **Complete functionality**: All exports available in production
- ✅ **No workarounds**: Consumers can use AppProvider directly
- ✅ **Consistent API**: Same exports in development and production
- ✅ **Better DX**: Developers can use all features without issues

### Negative

- ⚠️ **Larger bundle**: Including all exports may increase bundle size (acceptable)
- ⚠️ **Build complexity**: May need more explicit configuration

### Risks

- **Build failures**: Changes to bundling config may break other parts
- **Performance**: Larger bundle may impact load time (mitigated by tree-shaking at consumer level)

### Mitigation

- **Incremental changes**: Make small, testable changes
- **Comprehensive testing**: Test all exports after changes
- **Build validation**: Automated checks prevent regressions
- **Documentation**: Document any bundle size changes

## Alternatives Considered

### Alternative 1: Separate Provider Package

**Approach**: Publish providers as separate package entry point.

**Rejected because**:
- Adds complexity for consumers
- Doesn't solve the root problem
- Inconsistent with current architecture

### Alternative 2: Dynamic Imports Only

**Approach**: Only support dynamic imports for providers.

**Rejected because**:
- Poor developer experience
- Breaks existing usage patterns
- Not a real solution

### Alternative 3: Documentation Workaround

**Approach**: Document that providers must be imported differently.

**Rejected because**:
- Doesn't solve the problem
- Confusing for consumers
- Not acceptable for production

## Implementation Plan

### Phase 1: Investigation (Day 1)
- [ ] Analyze current build output
- [ ] Identify missing exports
- [ ] Check for circular dependencies
- [ ] Review Vite/Rollup configuration

### Phase 2: Fix Configuration (Day 2)
- [ ] Update Vite config to preserve exports
- [ ] Test build output
- [ ] Verify AppProvider is included
- [ ] Verify all providers are included

### Phase 3: Validation (Day 3)
- [ ] Create build validation script
- [ ] Add to CI/CD pipeline
- [ ] Test in clean Next.js project
- [ ] Verify all imports work

### Phase 4: Documentation (Day 4)
- [ ] Update migration guide
- [ ] Document the fix
- [ ] Update examples
- [ ] Release notes

## Testing Strategy

### Unit Tests
```typescript
// tests/build-exports.test.ts
describe('Build Exports', () => {
  it('should include AppProvider', () => {
    const pkg = require('../dist/index.js');
    expect(pkg.AppProvider).toBeDefined();
  });
  
  it('should include all providers', () => {
    const pkg = require('../dist/index.js');
    expect(pkg.ConfigProvider).toBeDefined();
    expect(pkg.ThemeProvider).toBeDefined();
  });
});
```

### Integration Tests
```typescript
// tests/consumer-integration.test.ts
describe('Consumer Integration', () => {
  it('should import AppProvider in Next.js', async () => {
    // Test in actual Next.js environment
  });
});
```

## Success Criteria

- [ ] AppProvider is exported from `dist/index.js`
- [ ] All providers are accessible in production build
- [ ] Build validation script catches missing exports
- [ ] Test Next.js project can import AppProvider without errors
- [ ] No breaking changes for existing consumers
- [ ] Bundle size increase is acceptable (< 10%)

## References

- [Issue Report](./issues/design-system-build-issue.md)
- [Vite: Library Mode](https://vitejs.dev/guide/build.html#library-mode)
- [Rollup: Output Options](https://rollupjs.org/configuration-options/#output)
- [ADR-0001: Build and Distribution Strategy](./adr/0001-build-and-distribution-strategy.md)

## Notes

- This ADR addresses the second issue in `design-system-build-issue.md`
- The solution should work in conjunction with ADR-0001
- Build validation is critical to prevent regressions
- Consider bundle size impact but prioritize functionality
