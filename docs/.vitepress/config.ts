import { defineConfig } from 'vitepress';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Runiq',
  description:
    'A markdown-friendly diagram DSL with JSON twin that compiles to standards-compliant SVG',

  // Enable clean URLs (no .html extension needed)
  cleanUrls: true,

  // Base URL (adjust for GitHub Pages if needed)
  // base: '/runiq/',

  head: [
    [
      'link',
      {
        rel: 'icon',
        type: 'image/png',
        href: '/images/runiq.mascot.badge.png',
      },
    ],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/images/runiq.mascot.badge.png',

    nav: [
      { text: 'Playground', link: 'https://editor.runiq.org' },
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Gallery', link: '/examples/gallery' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Reference', link: '/reference/shapes' },
      {
        text: 'Export',
        items: [
          { text: 'SPICE Netlist', link: '/export/spice' },
          { text: 'Verilog HDL', link: '/export/verilog' },
          { text: 'LaTeX/TikZ', link: '/export/latex' },
          { text: 'Simulink', link: '/export/simulink' },
        ],
      },
      {
        text: 'v0.1.0',
        items: [
          { text: 'Changelog', link: '/CHANGELOG' },
          { text: 'Contributing', link: '/contributing' },
        ],
      },
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Runiq?', link: '/guide/what-is-runiq' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Quick Start', link: '/guide/quick-start' },
            { text: 'Profiles', link: '/guide/profiles' },
          ],
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Shapes Overview', link: '/guide/shapes' },
            { text: 'Edges & Connections', link: '/guide/edges' },
            { text: 'Containers', link: '/guide/containers' },
            { text: 'Styling', link: '/guide/styling' },
            { text: 'Themes', link: '/guide/themes' },
            { text: 'Layout', link: '/guide/layout' },
            { text: 'Reserved Keywords', link: '/guide/reserved-keywords' },
            { text: 'Web SDK Integration', link: '/guide/web-sdk' },
          ],
        },
        {
          text: 'Glyphsets (Smart Art)',
          items: [
            { text: 'What are Glyphsets?', link: '/guide/glyphsets' },
            { text: 'Process Glyphsets', link: '/guide/glyphsets-process' },
            { text: 'List Glyphsets', link: '/guide/glyphsets-list' },
            {
              text: 'Comparison Glyphsets',
              link: '/guide/glyphsets-comparison',
            },
            {
              text: 'Visualization Glyphsets',
              link: '/guide/glyphsets-visualization',
            },
            { text: 'Hierarchy Glyphsets', link: '/guide/glyphsets-hierarchy' },
            {
              text: 'Relationship Glyphsets',
              link: '/guide/glyphsets-relationship',
            },
          ],
        },
        {
          text: 'Diagram Profile',
          items: [
            { text: 'Flowcharts', link: '/guide/flowcharts' },
            { text: 'Mindmap Diagrams', link: '/guide/mindmap-diagrams' },
            { text: 'Venn Diagrams', link: '/guide/venn-diagrams' },
            { text: 'Pyramid Diagrams', link: '/guide/pyramid-diagrams' },
            { text: 'Data Flow Diagrams', link: '/guide/dfd-diagrams' },
            { text: 'UML Class Diagrams', link: '/guide/class-diagrams' },
            { text: 'Component Diagrams', link: '/guide/component-diagrams' },
            { text: 'ERD Diagrams', link: '/guide/erd-diagrams' },
            {
              text: 'State Machine Diagrams',
              link: '/guide/state-machine-diagrams',
            },
            { text: 'Activity Diagrams', link: '/guide/activity-diagrams' },
            { text: 'BPMN Diagrams', link: '/guide/bpmn-diagrams' },
            { text: 'Use Case Diagrams', link: '/guide/use-case-diagrams' },
            { text: 'C4 Architecture', link: '/guide/c4-architecture' },
            {
              text: 'Control system Diagrams',
              link: '/guide/control-diagrams',
            },
            { text: 'Network Diagrams', link: '/guide/network-diagrams' },
            { text: 'AWS Diagrams', link: '/guide/aws-diagrams' },
            { text: 'Charts & Graphs', link: '/guide/charts' },
            //{ text: 'Pedigree Charts', link: '/guide/pedigree-charts' },
            { text: 'Quantum Circuits', link: '/guide/quantum-circuits' },
          ],
        },
        {
          text: 'Specialized Profiles',
          items: [
            { text: 'Electrical Circuits', link: '/guide/electrical' },
            { text: 'Digital Circuits', link: '/guide/digital-circuits' },
            { text: 'Wardley Maps', link: '/guide/wardley-maps' },
            { text: 'Sequence Diagrams', link: '/guide/sequence-diagrams' },
            { text: 'Timeline Diagrams', link: '/guide/timeline-diagrams' },
            { text: 'Pneumatic Circuits', link: '/guide/pneumatic-circuits' },
            { text: 'Hydraulic Circuits', link: '/guide/hydraulic-circuits' },
            { text: 'P&ID Diagrams', link: '/guide/pid-diagrams' },
          ],
        },
        {
          text: 'Help',
          items: [{ text: 'Troubleshooting', link: '/guide/troubleshooting' }],
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Shapes', link: '/reference/shapes' },
            { text: 'Edges', link: '/reference/edges' },
            { text: 'DSL Syntax', link: '/reference/dsl' },
            { text: 'JSON Format', link: '/reference/json' },
            // { text: 'Data-Driven Diagrams', link: '/reference/data-driven' },
            { text: 'Templates & Presets', link: '/reference/templates' },
            { text: 'Export Formats', link: '/reference/export' },
            { text: 'CLI Reference', link: '/reference/cli' },
          ],
        },
        {
          text: 'Glyphsets Reference',
          items: [
            { text: 'All Glyphsets', link: '/reference/glyphsets' },
            { text: 'Glyphset Themes', link: '/reference/glyphset-themes' },
          ],
        },
        {
          text: 'API Reference',
          items: [
            { text: 'Parser API', link: '/reference/api/parser' },
            { text: 'Renderer API', link: '/reference/api/renderer' },
            { text: 'Layout API', link: '/reference/api/layout' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jgreywolf/runiq' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Justin Greywolf',
    },

    search: {
      provider: 'local',
    },

    editLink: {
      pattern: 'https://github.com/jgreywolf/runiq/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium',
      },
    },
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    lineNumbers: true,
    async shikiSetup(shiki) {
      // Load custom Runiq grammar
      const runiqGrammar = JSON.parse(
        readFileSync(
          resolve(
            __dirname,
            '../../packages/parser-dsl/syntaxes/runiq.tmLanguage.json'
          ),
          'utf-8'
        )
      );
      // Add id field for Shiki v1.x
      await shiki.loadLanguage({
        ...runiqGrammar,
        id: 'runiq',
      });
    },
  },
});
