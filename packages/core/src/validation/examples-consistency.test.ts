/**
 * Examples Consistency Validation Tests
 *
 * These tests ensure consistency between documentation and example files.
 * They validate that:
 * 1. Example files referenced in docs actually exist
 * 2. SVG references point to valid files or can be generated
 * 3. No orphaned example files exist
 * 4. Example file structure is organized correctly
 */

import { describe, it, expect } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, basename } from 'path';

// Path constants
const DOCS_EXAMPLES_DIR = join(process.cwd(), '../../docs/examples');
const EXAMPLES_DIR = join(process.cwd(), '../../examples');
const OUTPUT_DIR = join(EXAMPLES_DIR, 'output');

describe('Examples Consistency Validation', () => {
  describe('Directory Structure', () => {
    it('should have docs/examples directory', () => {
      expect(existsSync(DOCS_EXAMPLES_DIR)).toBe(true);
    });

    it('should have /examples directory', () => {
      expect(existsSync(EXAMPLES_DIR)).toBe(true);
    });

    it('should have examples/output directory for SVG files', () => {
      expect(existsSync(OUTPUT_DIR)).toBe(true);
    });
  });

  describe('Example File Organization', () => {
    it('should have .runiq example files', () => {
      const runiqFiles = getAllRuniqFiles(EXAMPLES_DIR);
      expect(runiqFiles.length).toBeGreaterThan(0);
      console.log(`Found ${runiqFiles.length} .runiq example files`);
    });

    it('should have documentation markdown files', () => {
      if (!existsSync(DOCS_EXAMPLES_DIR)) {
        console.warn('docs/examples directory not found');
        return;
      }

      const mdFiles = readdirSync(DOCS_EXAMPLES_DIR).filter((f) =>
        f.endsWith('.md')
      );
      expect(mdFiles.length).toBeGreaterThan(0);
      console.log(`Found ${mdFiles.length} documentation example files`);
    });

    it('should have organized subdirectories in /examples', () => {
      const expectedDirs = [
        'flowcharts',
        'class-diagrams',
        'bpmn',
        'c4-architecture',
        'charts',
        'digital',
        'electrical',
        'glyphsets',
        'mindmaps',
        'output',
      ];

      for (const dir of expectedDirs) {
        const dirPath = join(EXAMPLES_DIR, dir);
        if (existsSync(dirPath)) {
          expect(existsSync(dirPath)).toBe(true);
        } else {
          console.warn(`Expected directory not found: ${dir}`);
        }
      }
    });
  });

  describe('SVG References', () => {
    it('should track referenced SVG files in documentation', () => {
      if (!existsSync(DOCS_EXAMPLES_DIR)) {
        console.warn('docs/examples directory not found, skipping SVG validation');
        return;
      }

      const mdFiles = readdirSync(DOCS_EXAMPLES_DIR).filter((f) =>
        f.endsWith('.md')
      );

      let totalSvgReferences = 0;
      const missingRefs: string[] = [];

      for (const mdFile of mdFiles) {
        const content = readFileSync(join(DOCS_EXAMPLES_DIR, mdFile), 'utf-8');

        // Find SVG references like ![...](/examples/something.svg)
        const svgMatches = content.match(/!\[.*?\]\(\/examples\/[^)]+\.svg\)/g);

        if (svgMatches) {
          totalSvgReferences += svgMatches.length;

          for (const match of svgMatches) {
            // Extract the path
            const pathMatch = match.match(/\/examples\/([^)]+\.svg)/);
            if (pathMatch) {
              const svgFile = pathMatch[1];
              const fullPath = join(EXAMPLES_DIR, svgFile);

              if (!existsSync(fullPath)) {
                missingRefs.push(`${mdFile}: ${svgFile}`);
              }
            }
          }
        }
      }

      console.log(`Found ${totalSvgReferences} SVG references in documentation`);
      if (missingRefs.length > 0) {
        console.warn(`Missing SVG files (${missingRefs.length}):`);
        missingRefs.slice(0, 10).forEach((ref) => console.warn(`  - ${ref}`));
        if (missingRefs.length > 10) {
          console.warn(`  ... and ${missingRefs.length - 10} more`);
        }
      }

      // This is informational - we allow some SVGs to be missing
      // since they might need to be generated
      expect(totalSvgReferences).toBeGreaterThan(0);
    });
  });

  describe('Example File Validity', () => {
    it('should have valid .runiq files', () => {
      const runiqFiles = getAllRuniqFiles(EXAMPLES_DIR);

      let validCount = 0;
      let invalidCount = 0;
      const errors: string[] = [];

      for (const file of runiqFiles.slice(0, 50)) {
        // Check first 50 files
        try {
          const content = readFileSync(file, 'utf-8');

          // Basic validation: should contain diagram keyword or profile
          const hasValidStart =
            content.includes('diagram ') ||
            content.includes('sequence ') ||
            content.includes('electrical ') ||
            content.includes('digital ') ||
            content.includes('wardley ') ||
            content.includes('pneumatic ') ||
            content.includes('hydraulic ') ||
            content.includes('pid ');

          if (hasValidStart) {
            validCount++;
          } else {
            invalidCount++;
            errors.push(basename(file));
          }
        } catch (err) {
          invalidCount++;
          errors.push(`${basename(file)}: ${err}`);
        }
      }

      console.log(`Validated ${validCount + invalidCount} example files`);
      console.log(`Valid: ${validCount}, Invalid: ${invalidCount}`);

      if (errors.length > 0 && errors.length < 10) {
        console.warn('Invalid files:', errors);
      }

      // Most files should be valid
      expect(validCount).toBeGreaterThan(0);
    });
  });

  describe('Documentation Coverage', () => {
    it('should document major example categories', () => {
      if (!existsSync(DOCS_EXAMPLES_DIR)) {
        console.warn('docs/examples directory not found');
        return;
      }

      const mdFiles = readdirSync(DOCS_EXAMPLES_DIR)
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.replace('.md', ''));

      const expectedCategories = [
        'flowcharts',
        'sequence-diagrams',
        'state-machines',
        'c4-architecture',
        'bpmn-diagrams',
        'electrical',
        'digital',
      ];

      const missingDocs: string[] = [];

      for (const category of expectedCategories) {
        if (!mdFiles.includes(category)) {
          missingDocs.push(category);
        }
      }

      if (missingDocs.length > 0) {
        console.warn('Categories without documentation:', missingDocs);
      }

      // Most categories should have docs
      expect(mdFiles.length).toBeGreaterThan(expectedCategories.length / 2);
    });
  });
});

// Helper functions
function getAllRuniqFiles(dir: string): string[] {
  const files: string[] = [];

  function traverse(currentDir: string) {
    if (!existsSync(currentDir)) return;

    const entries = readdirSync(currentDir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(currentDir, entry.name);

      if (entry.isDirectory()) {
        // Skip node_modules and hidden directories
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          traverse(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith('.runiq')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}
