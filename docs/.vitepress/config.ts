import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Runiq',
  description: 'A markdown-friendly diagram DSL with JSON twin that compiles to standards-compliant SVG',
  
  // Base URL (adjust for GitHub Pages if needed)
  // base: '/runiq/',
  
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }],
  ],

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.svg',
    
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'Examples', link: '/examples/' },
      { text: 'Reference', link: '/reference/shapes' },
      { 
        text: 'Export', 
        items: [
          { text: 'SPICE Netlist', link: '/export/spice' },
          { text: 'Verilog HDL', link: '/export/verilog' },
          { text: 'LaTeX/TikZ', link: '/export/latex' },
          { text: 'Simulink', link: '/export/simulink' },
        ]
      },
      {
        text: 'v0.1.0',
        items: [
          { text: 'Changelog', link: '/CHANGELOG' },
          { text: 'Contributing', link: '/contributing' },
        ]
      }
    ],

    sidebar: {
      '/guide/': [
        {
          text: 'Introduction',
          items: [
            { text: 'What is Runiq?', link: '/guide/what-is-runiq' },
            { text: 'Getting Started', link: '/guide/getting-started' },
            { text: 'Quick Start', link: '/guide/quick-start' },
          ]
        },
        {
          text: 'Core Concepts',
          items: [
            { text: 'Shapes', link: '/guide/shapes' },
            { text: 'Edges & Connections', link: '/guide/edges' },
            { text: 'Containers', link: '/guide/containers' },
            { text: 'Styling', link: '/guide/styling' },
            { text: 'Layout', link: '/guide/layout' },
          ]
        },
        {
          text: 'Diagram Types',
          items: [
            { text: 'Flowcharts', link: '/guide/flowcharts' },
            { text: 'Sequence Diagrams', link: '/guide/sequence' },
            { text: 'Use Case Diagrams', link: '/guide/use-case' },
            { text: 'Class Diagrams', link: '/guide/class' },
            { text: 'State Machines', link: '/guide/state-machine' },
            { text: 'ER Diagrams', link: '/guide/entity-relationship' },
            { text: 'Block Diagrams', link: '/guide/block-diagrams' },
          ]
        },
        {
          text: 'Circuits',
          items: [
            { text: 'Electrical Circuits', link: '/guide/electrical' },
            { text: 'Digital Logic', link: '/guide/digital' },
          ]
        },
      ],
      '/examples/': [
        {
          text: 'Examples',
          items: [
            { text: 'Overview', link: '/examples/' }
          ]
        },
        {
          text: 'Software Engineering',
          items: [
            { text: 'Flowcharts', link: '/examples/flowcharts' },
            { text: 'Use Case Diagrams', link: '/examples/use-case' },
            { text: 'Container Diagrams', link: '/examples/containers' }
          ]
        },
        {
          text: 'Control Systems',
          items: [
            { text: 'Block Diagrams', link: '/examples/block-diagrams' }
          ]
        },
        {
          text: 'Circuits',
          items: [
            { text: 'Electrical (Analog)', link: '/examples/electrical' },
            { text: 'Digital Logic', link: '/examples/digital' }
          ]
        },
      ],
      '/reference/': [
        {
          text: 'Reference',
          items: [
            { text: 'Shape Catalog', link: '/reference/shapes' },
            { text: 'DSL Syntax', link: '/reference/dsl' },
            { text: 'JSON Format', link: '/reference/json' },
            { text: 'CLI Usage', link: '/reference/cli' },
          ]
        },
        {
          text: 'API',
          items: [
            { text: 'Core API', link: '/reference/api/core' },
            { text: 'Parser', link: '/reference/api/parser' },
            { text: 'Layout', link: '/reference/api/layout' },
            { text: 'Renderer', link: '/reference/api/renderer' },
          ]
        },
      ],
      '/export/': [
        {
          text: 'Export Formats',
          items: [
            { text: 'SPICE Netlist', link: '/export/spice' },
            { text: 'Verilog HDL', link: '/export/verilog' },
            { text: 'LaTeX/TikZ', link: '/export/latex' },
            { text: 'Simulink', link: '/export/simulink' },
          ]
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/jgreywolf/runiq' }
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025 Justin Greywolf'
    },

    search: {
      provider: 'local'
    },

    editLink: {
      pattern: 'https://github.com/jgreywolf/runiq/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    }
  },

  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    lineNumbers: true,
  }
})
