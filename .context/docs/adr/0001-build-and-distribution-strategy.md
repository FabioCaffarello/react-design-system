# ADR-0001: Build and Distribution Strategy

**Status:** Proposed  
**Date:** 2026-01-19  
**Deciders:** Design System Team  
**Tags:** build, distribution, typescript, nextjs, compatibility

## Context

The React Design System currently has two critical build and distribution issues:

1. **TypeScript Source Files in Development Exports**: The package uses conditional exports that point to TypeScript source files (`.ts`) in development mode. This causes Next.js build failures because Next.js cannot process TypeScript syntax like `export type` without additional configuration.

2. **Missing Exports in Production Build**: The `AppProvider` and other providers are not included in the production build (`dist/index.js`), even though they are exported from `src/ui/index.ts` and have proper type definitions.

### Current State

**package.json exports configuration:**

```json
{
  "exports": {
    ".": {
      "types": "./dist/ui/index.d.ts",
      "import": {
        "development": "./src/ui/index.ts",  // ← Problem: TypeScript source
        "default": "./dist/index.js"
      },
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist", "src"]  // ← Problem: src is published
}
```

**Build process:**

- TypeScript declarations are generated separately: `tsc --emitDeclarationOnly`
- Vite builds JavaScript bundles: `vite build`
- The build creates ESM, CJS, and UMD formats
- However, providers are not being included in the main bundle

### Impact

- **Consumers must use workarounds**: Next.js projects require `transpilePackages` configuration
- **Slower builds**: Transpiling during consumption adds overhead
- **Missing functionality**: `AppProvider` cannot be imported in production
- **Poor developer experience**: Inconsistent behavior between development and production

## Decision

We will implement a **dual-build strategy** that:

1. **Eliminates TypeScript source exports**: Remove conditional `development` exports that point to `.ts` files
2. **Ensures complete builds**: Guarantee all exports from `src/ui/index.ts` are included in production builds
3. **Maintains type safety**: Continue generating comprehensive `.d.ts` files
4. **Optimizes for consumption**: Provide pre-transpiled JavaScript that works out-of-the-box

### Implementation Strategy

#### Phase 1: Fix Build Configuration

1. **Update Vite build to include all exports**:
   - Verify that `src/ui/index.ts` exports are properly bundled
   - Ensure providers are included in the main entry point
   - Add build validation to catch missing exports

2. **Remove conditional development exports**:
   - Remove `"development": "./src/ui/index.ts"` from all export paths
   - Use only transpiled builds: `"./dist/index.js"` for ESM, `"./dist/index.cjs"` for CJS
   - Keep type definitions: `"./dist/ui/index.d.ts"`

3. **Exclude source files from package**:
   - Remove `"src"` from `files` array in `package.json`
   - Add `.npmignore` to explicitly exclude `src/` directory
   - Only publish `dist/` and necessary files (README, LICENSE, etc.)

#### Phase 2: Build Process Improvements

1. **Unified build script**:

   ```json
   {
     "scripts": {
       "build": "npm run build:types && npm run build:js && npm run build:validate",
       "build:types": "tsc --project tsconfig.app.json --declaration --emitDeclarationOnly --outDir dist",
       "build:js": "vite build",
       "build:validate": "node scripts/validate-build-exports.js"
     }
   }
   ```

2. **Build validation script**:
   - Compare exports from `src/ui/index.ts` with `dist/index.js`
   - Verify all named exports are present
   - Fail build if exports are missing

3. **Entry point verification**:
   - Ensure `vite.config.ts` entry points match `package.json` exports
   - Verify all entry points are built correctly

#### Phase 3: Testing and Validation

1. **Create test consumer project**:
   - Set up minimal Next.js 15 project
   - Test imports without `transpilePackages`
   - Verify all exports work correctly

2. **CI/CD validation**:
   - Add build validation to CI pipeline
   - Test package consumption in clean environment
   - Verify tree-shaking works correctly

## Consequences

### Positive

- ✅ **No workarounds needed**: Consumers can use the package without special configuration
- ✅ **Faster builds**: Pre-transpiled code reduces build time for consumers
- ✅ **Better tree-shaking**: Bundlers can optimize pre-transpiled code more effectively
- ✅ **Consistent behavior**: Same code path for development and production
- ✅ **Complete exports**: All functionality available in production builds
- ✅ **Universal compatibility**: Works with Next.js, Vite, Webpack, and other bundlers

### Negative

- ⚠️ **Larger package size**: Source files removed, but this is acceptable
- ⚠️ **Development workflow change**: Developers consuming the package won't see source code directly
- ⚠️ **Build time increase**: Our build process may take slightly longer (acceptable trade-off)

### Risks

- **Breaking change**: Existing consumers using development exports will need to update
- **Version bump required**: This is a breaking change, requires major version bump
- **Migration needed**: Consumers may need to update their imports

### Mitigation

- **Semantic versioning**: Release as v2.0.0 with clear migration guide
- **Migration documentation**: Provide step-by-step guide for consumers
- **Deprecation notice**: Announce changes in advance
- **Backward compatibility period**: Consider maintaining v1.x for transition period

## Alternatives Considered

### Alternative 1: Keep Development Exports with Better Transpilation

**Approach**: Keep conditional exports but ensure TypeScript is properly transpiled.

**Rejected because**:

- Still requires consumers to configure transpilation
- Inconsistent behavior between environments
- Doesn't solve the missing exports issue

### Alternative 2: Separate Development Package

**Approach**: Publish separate `@fabio.caffarello/react-design-system-dev` package with source files.

**Rejected because**:

- Adds complexity for consumers
- Maintenance overhead for two packages
- Doesn't align with industry best practices

### Alternative 3: TypeScript-Only Package

**Approach**: Publish only TypeScript source and require all consumers to transpile.

**Rejected because**:

- Forces all consumers to configure transpilation
- Poor developer experience
- Not compatible with many build tools out-of-the-box

## Implementation Plan

### Step 1: Update Build Configuration (Week 1)

- [ ] Remove `development` exports from `package.json`
- [ ] Update `files` array to exclude `src/`
- [ ] Create build validation script
- [ ] Update Vite config to ensure all exports are included

### Step 2: Fix Missing Exports (Week 1)

- [ ] Investigate why providers are not in build
- [ ] Fix Vite bundling to include all exports
- [ ] Verify AppProvider is in dist/index.js
- [ ] Test all exports are accessible

### Step 3: Testing (Week 2)

- [ ] Create test Next.js project
- [ ] Verify all imports work without transpilePackages
- [ ] Test tree-shaking
- [ ] Performance benchmarks

### Step 4: Documentation and Release (Week 2)

- [ ] Update migration guide
- [ ] Update package documentation
- [ ] Release v2.0.0
- [ ] Announce breaking changes

## References

- [Next.js: transpilePackages](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)
- [TypeScript: Publishing Declaration Files](https://www.typescriptlang.org/docs/handbook/declaration-files/publishing.html)
- [npm: package.json exports field](https://nodejs.org/api/packages.html#exports)
- [Vite: Library Mode](https://vitejs.dev/guide/build.html#library-mode)

## Notes

- This ADR addresses both issues mentioned in `design-system-build-issue.md`
- The solution prioritizes consumer experience and industry best practices
- Breaking changes are acceptable for a major version release
- Future improvements can include ESM-only builds for better tree-shaking
