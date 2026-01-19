# RFC-0001: Removal of Conditional Development Exports

**Status:** Draft  
**Date:** 2026-01-19  
**Author:** Design System Team  
**Tags:** exports, build, typescript, compatibility

## Summary

This RFC proposes removing conditional `development` exports from the package.json that point to TypeScript source files. This change will eliminate the need for consumers to configure `transpilePackages` in Next.js and ensure consistent behavior across all environments.

## Motivation

### Current Problem

The package currently uses conditional exports that point to TypeScript source files in development:

```json
{
  "exports": {
    ".": {
      "import": {
        "development": "./src/ui/index.ts",  // ← TypeScript source
        "default": "./dist/index.js"         // ← Transpiled JavaScript
      }
    }
  }
}
```

**Issues:**

1. Next.js cannot process TypeScript syntax (`export type`, `interface`, etc.) without configuration
2. Consumers must add `transpilePackages` to their Next.js config
3. Inconsistent behavior between development and production
4. Build performance impact on consumers

### Consumer Impact

**Current workaround required:**

```javascript
// next.config.js
const nextConfig = {
  transpilePackages: ['@fabio.caffarello/react-design-system'],
};
```

This workaround:

- Adds build overhead
- Requires configuration knowledge
- May break with Next.js updates
- Not ideal for production

## Detailed Design

### Proposed Change

Remove all conditional `development` exports and use only transpiled builds:

```json
{
  "exports": {
    ".": {
      "types": "./dist/ui/index.d.ts",
      "import": "./dist/index.js",      // ← Always transpiled
      "require": "./dist/index.cjs"     // ← Always transpiled
    },
    "./atoms": {
      "types": "./dist/ui/atoms/index.d.ts",
      "import": "./dist/atoms/index.js",
      "require": "./dist/atoms/index.cjs"
    }
    // ... other exports follow same pattern
  },
  "files": ["dist"]  // ← Remove "src" from published files
}
```

### Benefits

1. **Zero configuration**: Consumers can use the package immediately
2. **Consistent behavior**: Same code path in all environments
3. **Better performance**: Pre-transpiled code is faster to process
4. **Universal compatibility**: Works with all bundlers out-of-the-box
5. **Better tree-shaking**: Bundlers can optimize pre-transpiled code more effectively

### Trade-offs

1. **Larger package size**: Source files won't be included (acceptable)
2. **No source debugging**: Consumers won't see original TypeScript (mitigated by source maps)
3. **Breaking change**: Requires major version bump

## Implementation

### Phase 1: Build Configuration

1. Update `package.json`:

   ```json
   {
     "exports": {
       ".": {
         "types": "./dist/ui/index.d.ts",
         "import": "./dist/index.js",
         "require": "./dist/index.cjs"
       }
     },
     "files": ["dist", "README.md", "LICENSE"]
   }
   ```

2. Remove `src` from published files:
   - Update `files` array
   - Add `.npmignore` if needed

### Phase 2: Build Process

1. Ensure build generates complete bundles:
   - Verify all exports are included
   - Test that providers are in the build
   - Validate entry points

2. Add build validation:

   ```javascript
   // scripts/validate-build-exports.js
   // Compare src/ui/index.ts exports with dist/index.js
   // Fail if exports are missing
   ```

### Phase 3: Testing

1. Create test consumer:

   ```bash
   # Create minimal Next.js project
   npx create-next-app@latest test-consumer
   cd test-consumer
   npm install @fabio.caffarello/react-design-system@2.0.0
   # Test imports without transpilePackages
   ```

2. Verify:
   - All exports work
   - No TypeScript errors
   - Build succeeds
   - Tree-shaking works

## Migration Guide

### For Consumers

**Before (v1.x):**

```javascript
// next.config.js
const nextConfig = {
  transpilePackages: ['@fabio.caffarello/react-design-system'],
};
```

**After (v2.0.0):**

```javascript
// next.config.js
// No special configuration needed!
const nextConfig = {
  // ... other config
};
```

### Breaking Changes

- **Removed**: Conditional `development` exports
- **Removed**: Source files from published package
- **Changed**: All imports now use transpiled code

### Compatibility

- ✅ Next.js 13+
- ✅ Next.js 14+
- ✅ Next.js 15+
- ✅ Vite
- ✅ Webpack
- ✅ Rollup
- ✅ esbuild

## Alternatives Considered

### Alternative 1: Better TypeScript Transpilation

Keep conditional exports but ensure TypeScript is properly handled.

**Rejected**: Still requires consumer configuration and doesn't solve the root problem.

### Alternative 2: Separate Dev Package

Publish source files in separate `-dev` package.

**Rejected**: Adds complexity and maintenance overhead.

### Alternative 3: Documentation Only

Keep current setup but improve documentation.

**Rejected**: Doesn't solve the developer experience issue.

## Open Questions

1. **Source maps**: Should we include source maps for debugging?
   - **Answer**: Yes, already configured in `vite.config.ts`

2. **Version strategy**: Should this be v2.0.0 or v1.10.0?
   - **Answer**: v2.0.0 (breaking change)

3. **Backward compatibility**: Should we maintain v1.x for a transition period?
   - **Answer**: Yes, for 3 months after v2.0.0 release

## Timeline

- **Week 1**: Implementation and testing
- **Week 2**: Documentation and migration guide
- **Week 3**: Release v2.0.0
- **Week 4+**: Monitor and support migration

## Success Criteria

- [ ] All exports work without `transpilePackages`
- [ ] Next.js 15 build succeeds in clean project
- [ ] All providers are accessible
- [ ] Tree-shaking works correctly
- [ ] Build validation catches missing exports
- [ ] Migration guide is complete
- [ ] Test consumer project validates all scenarios

## References

- [Issue Report](./issues/design-system-build-issue.md)
- [ADR-0001: Build and Distribution Strategy](./adr/0001-build-and-distribution-strategy.md)
- [Next.js: transpilePackages](https://nextjs.org/docs/app/api-reference/next-config-js/transpilePackages)
- [npm: package.json exports](https://nodejs.org/api/packages.html#exports)
