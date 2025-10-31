import { defineConfig } from 'vitepress';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Runiq',
  description:
    'A markdown-friendly diagram DSL with JSON twin that compiles to standards-compliant SVG',
  // Temporarily ignore dead links to allow publishing while stubs are added
  ignoreDeadLinks: true,

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
            { text: 'Layout', link: '/guide/layout' },
          ],
        },
        {
          text: 'Diagram Profile',
          items: [
            { text: 'Flowcharts', link: '/guide/flowcharts' },
            { text: 'UML Class Diagrams', link: '/guide/class-diagrams' },
            { text: 'Use Case Diagrams', link: '/guide/use-case-diagrams' },
            { text: 'C4 Architecture', link: '/guide/c4-architecture' },
            { text: 'Block Diagrams', link: '/guide/block-diagrams' },
            { text: 'Network Diagrams', link: '/guide/network-diagrams' },
            { text: 'AWS Diagrams', link: '/guide/aws-diagrams' },
            { text: 'Charts & Graphs', link: '/guide/charts' },
            { text: 'Pedigree Charts', link: '/guide/pedigree-charts' },
            { text: 'Quantum Circuits', link: '/guide/quantum-circuits' },
          ],
        },
        {
          text: 'Electrical Profile',
          items: [
            { text: 'Electrical Circuits', link: '/guide/electrical' },
          ],
        },
        {
          text: 'Digital Profile',
          items: [
            { text: 'Digital Circuits', link: '/guide/digital-circuits' },
          ],
        },
        {
          text: 'Wardley Profile',
          items: [
            { text: 'Wardley Maps', link: '/guide/wardley-maps' },
          ],
        },
        {
          text: 'Sequence Profile',
          items: [
            { text: 'Sequence Diagrams', link: '/guide/sequence-diagrams' },
          ],
        },
        {
          text: 'Pneumatic Profile',
          items: [
            { text: 'Pneumatic Circuits', link: '/guide/pneumatic-circuits' },
          ],
        },
        {
          text: 'Hydraulic Profile',
          items: [
            { text: 'Hydraulic Circuits', link: '/guide/hydraulic-circuits' },
          ],
        },
        {
          text: 'Help',
          items: [{ text: 'Troubleshooting', link: '/guide/troubleshooting' }],
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
  },
  // Map custom languages to built-ins for basic highlighting
  // https://vitepress.dev/guide/markdown#highlight
  // @ts-ignore
  async shikiSetup(shiki) {
    shiki.addAlias?.({ lang: 'runiq', name: 'yaml' });
    shiki.addAlias?.({ lang: 'spice', name: 'ini' });
    shiki.addAlias?.({ lang: 'langium', name: 'bnf' });
  },
});
