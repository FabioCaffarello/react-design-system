#!/usr/bin/env node

/**
 * Token Audit Script
 * 
 * Scans all component files for hardcoded Tailwind classes that should be
 * replaced with design tokens. Generates a report of findings.
 */

const fs = require('fs');
const path = require('path');

// Patterns to detect hardcoded classes
const HARDCODED_PATTERNS = {
  colors: {
    bg: /bg-(gray|indigo|red|green|blue|yellow|violet|purple|pink|orange|slate|zinc|neutral|stone|emerald|teal|cyan|sky|amber|lime)-\d+/g,
    text: /text-(gray|indigo|red|green|blue|yellow|violet|purple|pink|orange|slate|zinc|neutral|stone|emerald|teal|cyan|sky|amber|lime)-\d+/g,
    border: /border-(gray|indigo|red|green|blue|yellow|violet|purple|pink|orange|slate|zinc|neutral|stone|emerald|teal|cyan|sky|amber|lime)-\d+/g,
  },
  spacing: {
    padding: /[p|px|py|pt|pr|pb|pl]-\d+/g,
    margin: /[m|mx|my|mt|mr|mb|ml]-\d+/g,
    gap: /gap-\d+/g,
  },
  typography: {
    textSize: /text-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl|6xl|7xl|8xl|9xl)/g,
    fontWeight: /font-(thin|extralight|light|normal|medium|semibold|bold|extrabold|black)/g,
  },
  shadows: /shadow-(none|sm|md|lg|xl|2xl|inner)/g,
  radius: /rounded-(none|sm|md|lg|xl|2xl|3xl|full)/g,
  opacity: /opacity-\d+/g,
  zIndex: /z-\d+/g,
};

// Token replacement mappings
const TOKEN_REPLACEMENTS = {
  colors: {
    'bg-indigo-500': "getColorClass('primary', 'DEFAULT', 'bg')",
    'bg-indigo-600': "getColorClass('primary', 'dark', 'bg')",
    'bg-indigo-400': "getColorClass('primary', 'light', 'bg')",
    'text-indigo-500': "getColorClass('primary', 'DEFAULT', 'text')",
    'text-indigo-600': "getColorClass('primary', 'dark', 'text')",
    'bg-red-500': "getColorClass('error', 'DEFAULT', 'bg')",
    'text-red-500': "getColorClass('error', 'DEFAULT', 'text')",
    'text-red-600': "getColorClass('error', 'dark', 'text')",
    'bg-green-500': "getColorClass('success', 'DEFAULT', 'bg')",
    'text-green-500': "getColorClass('success', 'DEFAULT', 'text')",
    'bg-gray-50': "getColorClass('neutral', 'light', 'bg')",
    'bg-gray-100': "getColorClass('neutral', 'light', 'bg')",
    'bg-gray-200': "getColorClass('neutral', 'DEFAULT', 'bg')",
    'text-gray-500': "getColorClass('neutral', 'DEFAULT', 'text')",
    'text-gray-600': "getColorClass('neutral', 'dark', 'text')",
    'text-gray-700': "getColorClass('neutral', 'dark', 'text')",
    'text-gray-900': "getColorClass('neutral', 'dark', 'text')",
    'border-gray-200': "getColorClass('neutral', 'DEFAULT', 'border')",
    'border-gray-300': "getColorClass('neutral', 'DEFAULT', 'border')",
  },
  spacing: {
    'p-2': "getSpacingClass('sm', 'p')",
    'p-3': "getSpacingClass('md', 'p')",
    'p-4': "getSpacingClass('base', 'p')",
    'p-6': "getSpacingClass('lg', 'p')",
    'px-3': "getSpacingClass('md', 'px')",
    'px-4': "getSpacingClass('base', 'px')",
    'px-6': "getSpacingClass('lg', 'px')",
    'py-2': "getSpacingClass('sm', 'py')",
    'py-4': "getSpacingClass('base', 'py')",
    'gap-2': "getSpacingClass('sm', 'gap')",
    'gap-4': "getSpacingClass('base', 'gap')",
  },
  shadows: {
    'shadow-sm': "getShadowClass('sm')",
    'shadow-md': "getShadowClass('md')",
    'shadow-lg': "getShadowClass('lg')",
    'shadow-xl': "getShadowClass('xl')",
  },
  radius: {
    'rounded-md': "getRadiusClass('md')",
    'rounded-lg': "getRadiusClass('lg')",
    'rounded-xl': "getRadiusClass('xl')",
  },
};

/**
 * Scan a file for hardcoded classes
 */
function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const findings = {
    file: filePath,
    issues: [],
    suggestions: [],
  };

  // Check for hardcoded color classes
  Object.entries(HARDCODED_PATTERNS.colors).forEach(([type, pattern]) => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        findings.issues.push({
          type: 'color',
          category: type,
          class: match,
          line: getLineNumber(content, match),
          suggestion: TOKEN_REPLACEMENTS.colors[match] || `Use getColorClass() for ${match}`,
        });
      });
    }
  });

  // Check for hardcoded spacing classes
  Object.entries(HARDCODED_PATTERNS.spacing).forEach(([type, pattern]) => {
    const matches = content.match(pattern);
    if (matches) {
      matches.forEach(match => {
        findings.issues.push({
          type: 'spacing',
          category: type,
          class: match,
          line: getLineNumber(content, match),
          suggestion: TOKEN_REPLACEMENTS.spacing[match] || `Use getSpacingClass() for ${match}`,
        });
      });
    }
  });

  // Check for hardcoded shadow classes
  const shadowMatches = content.match(HARDCODED_PATTERNS.shadows);
  if (shadowMatches) {
    shadowMatches.forEach(match => {
      findings.issues.push({
        type: 'shadow',
        class: match,
        line: getLineNumber(content, match),
        suggestion: TOKEN_REPLACEMENTS.shadows[match] || `Use getShadowClass() for ${match}`,
      });
    });
  }

  // Check for hardcoded radius classes
  const radiusMatches = content.match(HARDCODED_PATTERNS.radius);
  if (radiusMatches) {
    radiusMatches.forEach(match => {
      findings.issues.push({
        type: 'radius',
        class: match,
        line: getLineNumber(content, match),
        suggestion: TOKEN_REPLACEMENTS.radius[match] || `Use getRadiusClass() for ${match}`,
      });
    });
  }

  // Check for hardcoded opacity classes
  const opacityMatches = content.match(HARDCODED_PATTERNS.opacity);
  if (opacityMatches) {
    opacityMatches.forEach(match => {
      findings.issues.push({
        type: 'opacity',
        class: match,
        line: getLineNumber(content, match),
        suggestion: `Use getOpacityClass() for ${match}`,
      });
    });
  }

  // Check for hardcoded z-index classes
  const zIndexMatches = content.match(HARDCODED_PATTERNS.zIndex);
  if (zIndexMatches) {
    zIndexMatches.forEach(match => {
      findings.issues.push({
        type: 'z-index',
        class: match,
        line: getLineNumber(content, match),
        suggestion: `Use getZIndexClass() for ${match}`,
      });
    });
  }

  return findings.issues.length > 0 ? findings : null;
}

/**
 * Get line number for a match in content
 */
function getLineNumber(content, match) {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(match)) {
      return i + 1;
    }
  }
  return null;
}

/**
 * Recursively find all component files
 */
function findComponentFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Skip test, stories, and tokens directories
      if (!file.includes('test') && !file.includes('stories') && file !== 'tokens') {
        findComponentFiles(filePath, fileList);
      }
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      // Skip test and story files
      if (!file.includes('.test.') && !file.includes('.stories.')) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

/**
 * Generate audit report
 */
function generateReport() {
  // Get project root (parent of scripts directory)
  const projectRoot = path.resolve(__dirname, '..');
  const srcDir = path.join(projectRoot, 'src/ui');
  
  if (!fs.existsSync(srcDir)) {
    console.error(`Error: Source directory not found: ${srcDir}`);
    process.exit(1);
  }
  
  const componentFiles = findComponentFiles(srcDir);

  const allFindings = [];
  const summary = {
    totalFiles: componentFiles.length,
    filesWithIssues: 0,
    totalIssues: 0,
    byType: {},
  };

  console.log('🔍 Scanning component files for hardcoded classes...\n');

  componentFiles.forEach(file => {
    const filePath = path.join(srcDir, file);
    const findings = scanFile(filePath);
    
    if (findings) {
      allFindings.push(findings);
      summary.filesWithIssues++;
      summary.totalIssues += findings.issues.length;

      findings.issues.forEach(issue => {
        summary.byType[issue.type] = (summary.byType[issue.type] || 0) + 1;
      });
    }
  });

  // Generate report
  console.log('📊 TOKEN AUDIT REPORT\n');
  console.log('='.repeat(80));
  console.log(`Total files scanned: ${summary.totalFiles}`);
  console.log(`Files with issues: ${summary.filesWithIssues}`);
  console.log(`Total issues found: ${summary.totalIssues}\n`);

  if (summary.totalIssues > 0) {
    console.log('Issues by type:');
    Object.entries(summary.byType)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        console.log(`  ${type}: ${count}`);
      });
    console.log('\n');

    // Detailed findings
    console.log('📋 DETAILED FINDINGS\n');
    allFindings.forEach((finding, index) => {
      console.log(`${index + 1}. ${finding.file}`);
      console.log(`   Issues: ${finding.issues.length}`);
      
      // Group by type
      const grouped = finding.issues.reduce((acc, issue) => {
        if (!acc[issue.type]) acc[issue.type] = [];
        acc[issue.type].push(issue);
        return acc;
      }, {});

      Object.entries(grouped).forEach(([type, issues]) => {
        console.log(`   ${type}:`);
        issues.slice(0, 5).forEach(issue => {
          console.log(`     Line ${issue.line}: ${issue.class}`);
          console.log(`       → ${issue.suggestion}`);
        });
        if (issues.length > 5) {
          console.log(`     ... and ${issues.length - 5} more`);
        }
      });
      console.log('');
    });

    // Generate suggestions file
    const projectRoot = path.resolve(__dirname, '..');
    const suggestionsPath = path.join(projectRoot, 'TOKEN_AUDIT_REPORT.md');
    const reportContent = generateMarkdownReport(summary, allFindings);
    fs.writeFileSync(suggestionsPath, reportContent);
    console.log(`\n✅ Detailed report saved to: ${suggestionsPath}`);
  } else {
    console.log('✅ No hardcoded classes found! All components are using tokens.');
  }
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(summary, findings) {
  let report = `# Token Audit Report\n\n`;
  report += `Generated: ${new Date().toISOString()}\n\n`;
  report += `## Summary\n\n`;
  report += `- Total files scanned: ${summary.totalFiles}\n`;
  report += `- Files with issues: ${summary.filesWithIssues}\n`;
  report += `- Total issues: ${summary.totalIssues}\n\n`;

  if (summary.totalIssues > 0) {
    report += `## Issues by Type\n\n`;
    Object.entries(summary.byType)
      .sort((a, b) => b[1] - a[1])
      .forEach(([type, count]) => {
        report += `- **${type}**: ${count}\n`;
      });
    report += `\n## Detailed Findings\n\n`;

    findings.forEach((finding, index) => {
      report += `### ${index + 1}. ${finding.file}\n\n`;
      report += `**Total issues:** ${finding.issues.length}\n\n`;

      const grouped = finding.issues.reduce((acc, issue) => {
        if (!acc[issue.type]) acc[issue.type] = [];
        acc[issue.type].push(issue);
        return acc;
      }, {});

      Object.entries(grouped).forEach(([type, issues]) => {
        report += `#### ${type} (${issues.length})\n\n`;
        issues.forEach(issue => {
          report += `- Line ${issue.line}: \`${issue.class}\`\n`;
          report += `  - Suggestion: \`${issue.suggestion}\`\n`;
        });
        report += `\n`;
      });
    });
  }

  return report;
}

// Run audit
try {
  generateReport();
} catch (error) {
  console.error('Error running audit:', error);
  process.exit(1);
}
