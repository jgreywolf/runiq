import { ssrRenderAttrs, ssrRenderStyle } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"GitHub Issues Templates for Unimplemented Diagram Types","description":"","frontmatter":{},"headers":[],"relativePath":"GITHUB-ISSUES-TEMPLATES.md","filePath":"GITHUB-ISSUES-TEMPLATES.md","lastUpdated":1774998353000}');
const _sfc_main = { name: "GITHUB-ISSUES-TEMPLATES.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="github-issues-templates-for-unimplemented-diagram-types" tabindex="-1">GitHub Issues Templates for Unimplemented Diagram Types <a class="header-anchor" href="#github-issues-templates-for-unimplemented-diagram-types" aria-label="Permalink to &quot;GitHub Issues Templates for Unimplemented Diagram Types&quot;">​</a></h1><p><strong>Date:</strong> February 8, 2026<br><strong>Purpose:</strong> Ready-to-use GitHub issue templates for all 46 unimplemented diagram types<br><strong>Status:</strong> Ready for bulk issue creation</p><hr><h2 id="how-to-use-these-templates" tabindex="-1">How to Use These Templates <a class="header-anchor" href="#how-to-use-these-templates" aria-label="Permalink to &quot;How to Use These Templates&quot;">​</a></h2><ol><li>Copy each template below</li><li>Create a new GitHub issue at: <a href="https://github.com/quipolabs/runiq/issues/new" target="_blank" rel="noreferrer">https://github.com/quipolabs/runiq/issues/new</a></li><li>Paste the template content</li><li>Assign appropriate labels (enhancement, diagram-type, priority, etc.)</li><li>Add to project board/milestone as needed</li></ol><p><strong>Suggested Labels:</strong></p><ul><li><code>enhancement</code> - All diagram type additions</li><li><code>diagram-type</code> - Specific to diagram support</li><li><code>quick-win</code> - Tier 1 items (1-3 days)</li><li><code>medium-effort</code> - Tier 2 items (3-7 days)</li><li><code>high-effort</code> - Tier 3 items (1-3 weeks)</li><li><code>engineering</code> - Engineering diagram types (P&amp;ID, pneumatic, etc.)</li><li><code>visualization</code> - Chart/graph types</li><li><code>architecture</code> - Needs architecture changes</li></ul><hr><h3 id="issue-5-kinematic-diagrams-robotics-mechanisms" tabindex="-1">Issue 5: Kinematic Diagrams (Robotics/Mechanisms) <a class="header-anchor" href="#issue-5-kinematic-diagrams-robotics-mechanisms" aria-label="Permalink to &quot;Issue 5: Kinematic Diagrams (Robotics/Mechanisms)&quot;">​</a></h3><div class="language-markdown vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">## 🎯 Feature: Kinematic Diagram Support</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">### Description</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">Add kinematic diagram support for robotics and mechanism design. Shows motion relationships and linkages using topological (not geometric) approach.</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">### Current Status</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Node-edge model fits perfectly</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Layout algorithms available</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Kinematic-specific shapes available</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">### Implementation Requirements</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}">**Effort:**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> 2-3 days</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}">**Priority:**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> High (Robotics applications)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}">**Complexity:**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> Low-Medium</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">#### Phase 1: Joint Shapes (1 day)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}">**20-25 Symbols:**</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Revolute joint (pin/hinge)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Prismatic joint (slider)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Spherical joint (ball)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Universal joint</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Fixed joint</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Cylindrical joint</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Planar joint</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">#### Phase 2: Link Shapes (4 hours)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Binary link (2 connections)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Ternary link (3 connections)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Quaternary link (4 connections)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Ground/fixed link</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">#### Phase 3: Actuators &amp; End Effectors (4 hours)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Linear actuator</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Rotary motor</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Gripper (parallel jaw)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Gripper (angular)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Tool mount</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Spring</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Damper</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Cam</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Gear</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">#### Phase 4: DSL Syntax (2 hours)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">\`\`\`runiq</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">diagram kinematic &quot;4-Bar Linkage&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  node Ground { type: fixed-link }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  node Link1 { type: binary-link, length: 100 }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  node Link2 { type: binary-link, length: 80 }</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  node Link3 { type: binary-link, length: 90 }</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  joint J1 { type: revolute } connects Ground, Link1</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  joint J2 { type: revolute } connects Link1, Link2</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  joint J3 { type: revolute } connects Link2, Link3</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  joint J4 { type: revolute } connects Link3, Ground</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  actuator Motor at J1</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br></div></div><h4 id="phase-5-examples-4-hours" tabindex="-1">Phase 5: Examples (4 hours) <a class="header-anchor" href="#phase-5-examples-4-hours" aria-label="Permalink to &quot;Phase 5: Examples (4 hours)&quot;">​</a></h4><ul><li>[x] 4-bar linkage</li><li>[x] Crank-slider mechanism</li><li>[x] Robot arm (3-DOF)</li><li>[x] Walking mechanism</li><li>[x] Gripper mechanism</li></ul><h3 id="testing-requirements" tabindex="-1">Testing Requirements <a class="header-anchor" href="#testing-requirements" aria-label="Permalink to &quot;Testing Requirements&quot;">​</a></h3><ul><li>[ ] All joint symbols render</li><li>[ ] Links connect properly</li><li>[ ] Actuator placement</li><li>[ ] DOF calculation (optional)</li><li>[ ] Motion simulation (future)</li></ul><h3 id="acceptance-criteria" tabindex="-1">Acceptance Criteria <a class="header-anchor" href="#acceptance-criteria" aria-label="Permalink to &quot;Acceptance Criteria&quot;">​</a></h3><ul><li>[x] 25 kinematic symbols</li><li>[x] Joint-link connections</li><li>[x] 5+ example mechanisms</li><li>[ ] 30+ tests passing</li><li>[x] Documentation with robotics applications</li></ul><h3 id="export-options-future" tabindex="-1">Export Options (Future) <a class="header-anchor" href="#export-options-future" aria-label="Permalink to &quot;Export Options (Future)&quot;">​</a></h3><ul><li>[ ] DH parameters (Denavit-Hartenberg)</li><li>[ ] URDF (Unified Robot Description Format)</li><li>[ ] Motion equations</li></ul><h3 id="estimated-effort" tabindex="-1">Estimated Effort <a class="header-anchor" href="#estimated-effort" aria-label="Permalink to &quot;Estimated Effort&quot;">​</a></h3><p><strong>Total: 2-3 days</strong> (symbols + examples + tests)</p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Issue 6: Control System Diagrams (Ladder Logic/FBD)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`markdown</span></span>
<span class="line"><span>## Feature: PLC Control System Diagrams (Ladder Logic &amp; Function Block)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Description</span></span>
<span class="line"><span>Add support for PLC programming diagrams following IEC 61131-3 standard. Reuses schematic renderer infrastructure.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Current Status</span></span>
<span class="line"><span>- [x] Control profile added (ladder/FBD variants)</span></span>
<span class="line"><span>- [x] Schematic renderer wiring via parts + nets</span></span>
<span class="line"><span>- [x] Basic IEC ladder symbols (NO/NC contacts, coil, set/reset, TON)</span></span>
<span class="line"><span>- [x] Documentation updated for control profile (legacy control system block diagrams retired)</span></span>
<span class="line"><span>- [ ] Expanded IEC 61131-3 symbol library (timers, counters, compare, math)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Implementation Requirements</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Effort:** 2-3 days</span></span>
<span class="line"><span>**Priority:** High (Factory automation, SCADA)</span></span>
<span class="line"><span>**Complexity:** Low (architecture reuse)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Phase 1: Ladder Logic Symbols</span></span>
<span class="line"><span>**30-40 Symbols:**</span></span>
<span class="line"><span>- [x] Normally Open (NO) contact</span></span>
<span class="line"><span>- [x] Normally Closed (NC) contact</span></span>
<span class="line"><span>- [x] Output coil</span></span>
<span class="line"><span>- [x] Latch coil (Set)</span></span>
<span class="line"><span>- [x] Unlatch coil (Reset)</span></span>
<span class="line"><span>- [x] Timer On-Delay (TON)</span></span>
<span class="line"><span>- [ ] Timer Off-Delay (TOF)</span></span>
<span class="line"><span>- [ ] Timer Pulse (TP)</span></span>
<span class="line"><span>- [ ] Counter Up (CTU)</span></span>
<span class="line"><span>- [ ] Counter Down (CTD)</span></span>
<span class="line"><span>- [ ] Counter Up-Down (CTUD)</span></span>
<span class="line"><span>- [ ] Compare (=, &lt;, &gt;, &lt;=, &gt;=, &lt;&gt;)</span></span>
<span class="line"><span>- [ ] Math operations (+, -, *, /)</span></span>
<span class="line"><span>- [ ] Move (MOV)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Phase 2: Function Block Symbols</span></span>
<span class="line"><span>- [ ] AND block</span></span>
<span class="line"><span>- [ ] OR block</span></span>
<span class="line"><span>- [ ] NOT block</span></span>
<span class="line"><span>- [ ] XOR block</span></span>
<span class="line"><span>- [ ] SR flip-flop</span></span>
<span class="line"><span>- [ ] RS flip-flop</span></span>
<span class="line"><span>- [ ] PID controller</span></span>
<span class="line"><span>- [ ] Scale function</span></span>
<span class="line"><span>- [ ] Limit function</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Phase 3: Profile Type</span></span>
<span class="line"><span>\`\`\`typescript</span></span>
<span class="line"><span>interface ControlProfile {</span></span>
<span class="line"><span>  type: &#39;control&#39;;</span></span>
<span class="line"><span>  variant: &#39;ladder&#39; | &#39;fbd&#39; | &#39;sfc&#39;;</span></span>
<span class="line"><span>  name: string;</span></span>
<span class="line"><span>  nets: NetAst[];</span></span>
<span class="line"><span>  parts: PartAst[];</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>\`\`\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Phase 4: DSL Syntax</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`runiq</span></span>
<span class="line"><span>control &quot;Motor Start-Stop&quot; {</span></span>
<span class="line"><span>  variant ladder</span></span>
<span class="line"><span>  net L1, L2, M1, M2</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  part Start type:NO_CONTACT pins:(L1,M1) doc:&quot;Start PB&quot;</span></span>
<span class="line"><span>  part Stop type:NC_CONTACT pins:(M1,M2) doc:&quot;Stop PB&quot;</span></span>
<span class="line"><span>  part Motor type:COIL pins:(M2,L2) doc:&quot;Motor coil&quot;</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>\`\`\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Phase 5: Examples</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- [x] Start-Stop motor control</span></span>
<span class="line"><span>- [x] Timer enable</span></span>
<span class="line"><span>- [ ] Traffic light sequence</span></span>
<span class="line"><span>- [ ] Conveyor belt control</span></span>
<span class="line"><span>- [ ] Tank filling with timers</span></span>
<span class="line"><span>- [ ] Batch process control</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Testing Requirements</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- [x] Core ladder symbols render</span></span>
<span class="line"><span>- [ ] Rung layout (horizontal)</span></span>
<span class="line"><span>- [ ] Power rail rendering</span></span>
<span class="line"><span>- [ ] Contact/coil connections</span></span>
<span class="line"><span>- [ ] FBD block connections</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Acceptance Criteria</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- [ ] 40+ ladder/FBD symbols</span></span>
<span class="line"><span>- [ ] IEC 61131-3 compliance</span></span>
<span class="line"><span>- [x] 2+ example programs</span></span>
<span class="line"><span>- [ ] 40+ tests passing</span></span>
<span class="line"><span>- [ ] Export to Structured Text (future)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Industry Standards</span></span>
<span class="line"><span></span></span>
<span class="line"><span>- IEC 61131-3 (PLC Programming Languages)</span></span>
<span class="line"><span>- PLCopen XML (exchange format)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Estimated Effort</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Total: 2-3 days** (symbols + ladder layout + tests)</span></span>
<span class="line"><span>\`\`\`</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Issue 7: HVAC Diagrams</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`markdown</span></span>
<span class="line"><span>## 🎯 Feature: HVAC System Diagrams</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Description</span></span>
<span class="line"><span>Add support for HVAC (Heating, Ventilation, Air Conditioning) system diagrams following ASHRAE standards.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Implementation Requirements</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Effort:** 2-3 days</span></span>
<span class="line"><span>**Priority:** Medium (Building systems)</span></span>
<span class="line"><span>**Complexity:** Low (node-edge model)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Phase 1: HVAC Equipment Symbols (1 day)</span></span>
<span class="line"><span>**25-35 Symbols:**</span></span>
<span class="line"><span>- [x] Air Handling Unit (AHU)</span></span>
<span class="line"><span>- [x] Fan (supply, return, exhaust)</span></span>
<span class="line"><span>- [x] Filter</span></span>
<span class="line"><span>- [x] Heating coil</span></span>
<span class="line"><span>- [x] Cooling coil</span></span>
<span class="line"><span>- [x] Humidifier</span></span>
<span class="line"><span>- [x] Dehumidifier</span></span>
<span class="line"><span>- [x] VAV box (Variable Air Volume)</span></span>
<span class="line"><span>- [x] Diffuser (supply, return)</span></span>
<span class="line"><span>- [x] Damper (motorized, manual, fire)</span></span>
<span class="line"><span>- [x] Ductwork (supply, return, exhaust)</span></span>
<span class="line"><span>- [x] Thermostat</span></span>
<span class="line"><span>- [x] Temperature sensor</span></span>
<span class="line"><span>- [x] Pressure sensor</span></span>
<span class="line"><span>- [x] Chiller</span></span>
<span class="line"><span>- [x] Boiler</span></span>
<span class="line"><span>- [x] Cooling tower</span></span>
<span class="line"><span>- [x] Pump</span></span>
<span class="line"><span>- [x] Heat exchanger</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Phase 2: DSL Syntax (4 hours)</span></span>
<span class="line"><span>\`\`\`runiq</span></span>
<span class="line"><span>diagram hvac &quot;Office HVAC System&quot;</span></span>
<span class="line"><span>  equipment AHU1 type:air-handling-unit cfm:5000</span></span>
<span class="line"><span>  equipment Fan1 type:supply-fan cfm:5000</span></span>
<span class="line"><span>  equipment Coil1 type:cooling-coil capacity:&quot;10 tons&quot;</span></span>
<span class="line"><span>  equipment VAV1 type:vav-box cfm-max:1000</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  duct Supply type:supply size:&quot;16x12&quot;</span></span>
<span class="line"><span>  duct Return type:return size:&quot;20x14&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  connect AHU1.out -&gt; Supply -&gt; VAV1.in</span></span>
<span class="line"><span>  connect VAV1.out -&gt; Zone1</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br><span class="line-number">93</span><br><span class="line-number">94</span><br><span class="line-number">95</span><br><span class="line-number">96</span><br><span class="line-number">97</span><br><span class="line-number">98</span><br><span class="line-number">99</span><br><span class="line-number">100</span><br><span class="line-number">101</span><br><span class="line-number">102</span><br><span class="line-number">103</span><br><span class="line-number">104</span><br><span class="line-number">105</span><br><span class="line-number">106</span><br><span class="line-number">107</span><br><span class="line-number">108</span><br><span class="line-number">109</span><br><span class="line-number">110</span><br><span class="line-number">111</span><br><span class="line-number">112</span><br><span class="line-number">113</span><br><span class="line-number">114</span><br><span class="line-number">115</span><br><span class="line-number">116</span><br><span class="line-number">117</span><br><span class="line-number">118</span><br><span class="line-number">119</span><br><span class="line-number">120</span><br><span class="line-number">121</span><br><span class="line-number">122</span><br><span class="line-number">123</span><br><span class="line-number">124</span><br><span class="line-number">125</span><br><span class="line-number">126</span><br><span class="line-number">127</span><br><span class="line-number">128</span><br><span class="line-number">129</span><br><span class="line-number">130</span><br><span class="line-number">131</span><br><span class="line-number">132</span><br><span class="line-number">133</span><br><span class="line-number">134</span><br><span class="line-number">135</span><br><span class="line-number">136</span><br><span class="line-number">137</span><br><span class="line-number">138</span><br><span class="line-number">139</span><br><span class="line-number">140</span><br><span class="line-number">141</span><br><span class="line-number">142</span><br><span class="line-number">143</span><br><span class="line-number">144</span><br><span class="line-number">145</span><br><span class="line-number">146</span><br><span class="line-number">147</span><br><span class="line-number">148</span><br><span class="line-number">149</span><br><span class="line-number">150</span><br><span class="line-number">151</span><br><span class="line-number">152</span><br><span class="line-number">153</span><br><span class="line-number">154</span><br><span class="line-number">155</span><br><span class="line-number">156</span><br><span class="line-number">157</span><br><span class="line-number">158</span><br><span class="line-number">159</span><br><span class="line-number">160</span><br><span class="line-number">161</span><br><span class="line-number">162</span><br></div></div><h4 id="phase-3-examples-4-hours" tabindex="-1">Phase 3: Examples (4 hours) <a class="header-anchor" href="#phase-3-examples-4-hours" aria-label="Permalink to &quot;Phase 3: Examples (4 hours)&quot;">​</a></h4><ul><li>[x] Simple office HVAC</li><li>[x] Multi-zone system</li><li>[x] Rooftop unit (RTU)</li><li>[x] Chilled water system</li><li>[x] Heat pump system</li></ul><h3 id="testing-requirements-1" tabindex="-1">Testing Requirements <a class="header-anchor" href="#testing-requirements-1" aria-label="Permalink to &quot;Testing Requirements&quot;">​</a></h3><ul><li>[x] All HVAC symbols render</li><li>[x] Duct routing</li><li>[x] Airflow direction indicators</li><li>[x] Equipment labels (CFM, BTU, tonnage)</li><li>[x] Equipment metadata labels (flow, capacity, pressure)</li></ul><h3 id="acceptance-criteria-1" tabindex="-1">Acceptance Criteria <a class="header-anchor" href="#acceptance-criteria-1" aria-label="Permalink to &quot;Acceptance Criteria&quot;">​</a></h3><ul><li>[x] 30+ HVAC symbols</li><li>[ ] ASHRAE standard compliance (partial)</li><li>[x] 5+ example systems</li><li>[x] 35+ tests passing</li></ul><h3 id="standards" tabindex="-1">Standards <a class="header-anchor" href="#standards" aria-label="Permalink to &quot;Standards&quot;">​</a></h3><ul><li>ASHRAE symbols</li><li>ISO 10628 (Process diagrams)</li></ul><h3 id="estimated-effort-1" tabindex="-1">Estimated Effort <a class="header-anchor" href="#estimated-effort-1" aria-label="Permalink to &quot;Estimated Effort&quot;">​</a></h3><p><strong>Total: 2-3 days</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Issue 9-12: Simple Visual Enhancements (1-2 days each)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`markdown</span></span>
<span class="line"><span>## 🎯 Feature: User Journey Diagrams</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Effort:** 1-2 days</span></span>
<span class="line"><span>**Complexity:** Low</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Requirements</span></span>
<span class="line"><span>- [ ] Timeline layout mode</span></span>
<span class="line"><span>- [ ] Emotion indicator shapes (😊 😐 😞)</span></span>
<span class="line"><span>- [ ] Phase/stage grouping</span></span>
<span class="line"><span>- [ ] Touchpoint markers</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: Pie Chart Support</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Effort:** 1-2 days</span></span>
<span class="line"><span>**Complexity:** Low</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Requirements</span></span>
<span class="line"><span>- [x] Pie slice shapes</span></span>
<span class="line"><span>- [x] Data-to-angle conversion</span></span>
<span class="line"><span>- [x] Percentage labels</span></span>
<span class="line"><span>- [x] Legend support</span></span>
<span class="line"><span>- [ ] Donut chart variant</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: Quadrant Chart (2x2 Matrix)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Effort:** 1-2 days</span></span>
<span class="line"><span>**Complexity:** Low</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Requirements</span></span>
<span class="line"><span>- [ ] 2D scatter layout</span></span>
<span class="line"><span>- [ ] Quadrant backgrounds</span></span>
<span class="line"><span>- [ ] Axis labels (X/Y)</span></span>
<span class="line"><span>- [ ] Item positioning by coordinates</span></span>
<span class="line"><span>- [ ] Example: Eisenhower matrix, BCG matrix</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br></div></div><hr><h2 id="tier-2-medium-effort-3-7-days-each" tabindex="-1">TIER 2: MEDIUM EFFORT (3-7 days each) <a class="header-anchor" href="#tier-2-medium-effort-3-7-days-each" aria-label="Permalink to &quot;TIER 2: MEDIUM EFFORT (3-7 days each)&quot;">​</a></h2><h3 id="issue-13-uml-timing-diagrams" tabindex="-1">Issue 13: UML Timing Diagrams <a class="header-anchor" href="#issue-13-uml-timing-diagrams" aria-label="Permalink to &quot;Issue 13: UML Timing Diagrams&quot;">​</a></h3><div class="language-markdown vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">## 🎯 Feature: UML Timing Diagrams</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">### Description</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">Add support for UML timing diagrams showing how object states change over time with timing constraints.</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">### Implementation Requirements</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}">**Effort:**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> 4-6 days  </span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}">**Priority:**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> Medium (Completes UML suite)  </span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}">**Complexity:**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> Medium-High</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">#### Phase 1: Time Axis &amp; Grid (1 day)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [ ] Horizontal time axis with tick marks</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [ ] Time scale (ms, s, min, h)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [ ] Grid overlay option</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [ ] Time labels</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">#### Phase 2: State Lifelines (1-2 days)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [ ] Vertical swimlanes per object</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [ ] State visualization (digital waveform)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [ ] State transition rendering</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [ ] State duration bars</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">#### Phase 3: Events &amp; Messages (1 day)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [ ] Event markers</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [ ] Message arrows between lifelines</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [ ] Timing constraints notation</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [ ] Duration constraints</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">#### Phase 4: DSL Syntax (1 day)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">\`\`\`runiq</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">diagram timing &quot;Door Controller&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  timeline scale:ms range:0-10000</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  object DoorSensor {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    state Closed at 0-2000</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    state Open at 2000-8000</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    state Closed at 8000-10000</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  }</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  object DoorMotor {</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    state Off at 0-2500</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    state Opening at 2500-3000</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    state On at 3000-7500</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    state Closing at 7500-8000</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">    state Off at 8000-10000</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  }</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  event SensorTriggered at 2000</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  constraint &quot;Motor starts within 500ms&quot; from:2000 to:2500</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br></div></div><h4 id="phase-5-examples-tests-1-day" tabindex="-1">Phase 5: Examples &amp; Tests (1 day) <a class="header-anchor" href="#phase-5-examples-tests-1-day" aria-label="Permalink to &quot;Phase 5: Examples &amp; Tests (1 day)&quot;">​</a></h4><ul><li>[ ] Digital signal timing</li><li>[ ] State machine timing</li><li>[ ] Protocol timing (UART, SPI)</li><li>[ ] 45+ tests</li></ul><h3 id="acceptance-criteria-2" tabindex="-1">Acceptance Criteria <a class="header-anchor" href="#acceptance-criteria-2" aria-label="Permalink to &quot;Acceptance Criteria&quot;">​</a></h3><ul><li>[ ] Time axis rendering</li><li>[ ] Multiple object lifelines</li><li>[ ] State changes visualized</li><li>[ ] Timing constraints shown</li><li>[ ] 3+ examples</li><li>[ ] 45+ tests passing</li></ul><h3 id="estimated-effort-2" tabindex="-1">Estimated Effort <a class="header-anchor" href="#estimated-effort-2" aria-label="Permalink to &quot;Estimated Effort&quot;">​</a></h3><p><strong>Total: 4-6 days</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Issue 14: P&amp;ID (Piping &amp; Instrumentation Diagrams)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`markdown</span></span>
<span class="line"><span>## 🎯 Feature: P&amp;ID Diagrams</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Description</span></span>
<span class="line"><span>Add support for Piping &amp; Instrumentation Diagrams (P&amp;ID) following ISA-5.1 standard. **Extremely high industry value!**</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Current Status</span></span>
<span class="line"><span>- [x] P&amp;ID profile implemented with equipment, instrumentation, lines, and control loops</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Implementation Requirements</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Effort:** 3-4 days</span></span>
<span class="line"><span>**Priority:** Very High (Process industry $$$$)</span></span>
<span class="line"><span>**Complexity:** Medium</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Phase 1: Equipment Symbols (1.5 days)</span></span>
<span class="line"><span>**40-60 Symbols:**</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Vessels &amp; Tanks:**</span></span>
<span class="line"><span>- [x] Pressure vessel (vertical/horizontal)</span></span>
<span class="line"><span>- [x] Storage tank</span></span>
<span class="line"><span>- [x] Reactor</span></span>
<span class="line"><span>- [x] Separator (horizontal/vertical)</span></span>
<span class="line"><span>- [x] Knockout drum</span></span>
<span class="line"><span>- [x] Flash drum</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Rotating Equipment:**</span></span>
<span class="line"><span>- [x] Centrifugal pump</span></span>
<span class="line"><span>- [x] Positive displacement pump</span></span>
<span class="line"><span>- [x] Compressor (centrifugal/reciprocating)</span></span>
<span class="line"><span>- [x] Fan/blower</span></span>
<span class="line"><span>- [x] Turbine</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Heat Transfer:**</span></span>
<span class="line"><span>- [x] Shell &amp; tube heat exchanger</span></span>
<span class="line"><span>- [x] Plate heat exchanger</span></span>
<span class="line"><span>- [x] Air cooler</span></span>
<span class="line"><span>- [x] Fired heater/furnace</span></span>
<span class="line"><span>- [x] Condenser</span></span>
<span class="line"><span>- [x] Reboiler</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Valves (20+ types):**</span></span>
<span class="line"><span>- [x] Gate valve</span></span>
<span class="line"><span>- [x] Globe valve</span></span>
<span class="line"><span>- [x] Ball valve</span></span>
<span class="line"><span>- [x] Butterfly valve</span></span>
<span class="line"><span>- [x] Check valve</span></span>
<span class="line"><span>- [x] Control valve</span></span>
<span class="line"><span>- [x] Safety relief valve</span></span>
<span class="line"><span>- [ ] Pressure reducing valve</span></span>
<span class="line"><span>- [x] Three-way valve</span></span>
<span class="line"><span>- [x] Plug valve</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Instrumentation:**</span></span>
<span class="line"><span>- [x] Pressure transmitter (PT)</span></span>
<span class="line"><span>- [x] Temperature transmitter (TT)</span></span>
<span class="line"><span>- [x] Flow transmitter (FT)</span></span>
<span class="line"><span>- [x] Level transmitter (LT)</span></span>
<span class="line"><span>- [x] Analyzer (AT)</span></span>
<span class="line"><span>- [ ] Control valve with positioner</span></span>
<span class="line"><span>- [x] Pressure indicator (PI)</span></span>
<span class="line"><span>- [x] Temperature indicator (TI)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Phase 2: Line Types (4 hours)</span></span>
<span class="line"><span>- [x] Process piping (thick solid)</span></span>
<span class="line"><span>- [x] Instrument signal (thin dashed)</span></span>
<span class="line"><span>- [x] Electrical signal</span></span>
<span class="line"><span>- [ ] Pneumatic signal</span></span>
<span class="line"><span>- [ ] Hydraulic signal</span></span>
<span class="line"><span>- [ ] Software/data link</span></span>
<span class="line"><span>- [x] Utility lines (steam, cooling water, etc.)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Phase 3: Tag Numbering (4 hours)</span></span>
<span class="line"><span>\`\`\`typescript</span></span>
<span class="line"><span>interface InstrumentTag {</span></span>
<span class="line"><span>  function: &#39;P&#39; | &#39;T&#39; | &#39;F&#39; | &#39;L&#39; | &#39;A&#39;; // Pressure, Temp, Flow, Level, Analyzer</span></span>
<span class="line"><span>  modifier?: &#39;I&#39; | &#39;T&#39; | &#39;C&#39;; // Indicator, Transmitter, Controller</span></span>
<span class="line"><span>  loop: number; // 101, 102, 103...</span></span>
<span class="line"><span>}</span></span>
<span class="line"><span>// Example: FT-101 = Flow Transmitter, loop 101</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br></div></div><h4 id="phase-4-dsl-syntax-1-day" tabindex="-1">Phase 4: DSL Syntax (1 day) <a class="header-anchor" href="#phase-4-dsl-syntax-1-day" aria-label="Permalink to &quot;Phase 4: DSL Syntax (1 day)&quot;">​</a></h4><div class="language-runiq vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">runiq</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">diagram</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> pid</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}"> &quot;Distillation Column&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  equipment</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> T-101 </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">type</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:vessel </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">label</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;Column T-101&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  equipment</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> E-101 </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">type</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">heat-exchanger</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> label</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;Reboiler E-101&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  equipment</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> P-101 </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">type</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">pump</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> label</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-dark": "#9ECBFF" })}">&quot;Bottoms Pump P-101&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  instrument</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> FT-101 </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">type</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">flow</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">-transmitter on:</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">line</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">-1</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  instrument</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> LT-101 </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">type</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">level</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">-transmitter on:T-101</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  instrument</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> TT-101 </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">type</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:temp-transmitter on:T-101</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  instrument</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> FCV-101 </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">type</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">control</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">-valve controlled-by:FT-101</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  line</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> Feed </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">type</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">process</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> from</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:battery-</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">limit</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> to</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:T-101.</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">in</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  line</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> Distillate </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">type</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">process</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> from</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:T-101.</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">top</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> to</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">condenser</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  line</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> Bottoms </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">type</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">process</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> from</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:T-101.</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">bottom</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}"> to</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:E-101</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">  signal</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> FT-101 -&gt; FCV-101 </span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">type</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">:</span><span style="${ssrRenderStyle({ "--shiki-light": "#D73A49", "--shiki-dark": "#F97583" })}">pneumatic</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br></div></div><h4 id="phase-5-examples-4-hours-1" tabindex="-1">Phase 5: Examples (4 hours) <a class="header-anchor" href="#phase-5-examples-4-hours-1" aria-label="Permalink to &quot;Phase 5: Examples (4 hours)&quot;">​</a></h4><ul><li>[x] Simple heat exchanger loop</li><li>[x] Distillation column</li><li>[x] Pump with instrumentation</li><li>[ ] Tank farm</li><li>[x] Chemical reactor system</li></ul><h3 id="testing-requirements-2" tabindex="-1">Testing Requirements <a class="header-anchor" href="#testing-requirements-2" aria-label="Permalink to &quot;Testing Requirements&quot;">​</a></h3><ul><li>[x] All 60 symbols render correctly</li><li>[ ] ISA-5.1 tag compliance</li><li>[x] Line type differentiation</li><li>[x] Instrument connection logic</li></ul><h3 id="acceptance-criteria-3" tabindex="-1">Acceptance Criteria <a class="header-anchor" href="#acceptance-criteria-3" aria-label="Permalink to &quot;Acceptance Criteria&quot;">​</a></h3><ul><li>[x] 60+ P&amp;ID symbols</li><li>[ ] ISA-5.1 standard compliance</li><li>[ ] Tag numbering system</li><li>[x] 5+ example P&amp;IDs</li><li>[ ] 50+ tests passing</li></ul><h3 id="industry-standards" tabindex="-1">Industry Standards <a class="header-anchor" href="#industry-standards" aria-label="Permalink to &quot;Industry Standards&quot;">​</a></h3><ul><li>ISA-5.1 (Instrumentation symbols)</li><li>ISO 14617 (Graphical symbols)</li><li>ISA-5.4 (Instrument loop diagrams)</li></ul><h3 id="market-value" tabindex="-1">Market Value <a class="header-anchor" href="#market-value" aria-label="Permalink to &quot;Market Value&quot;">​</a></h3><ul><li>AutoCAD P&amp;ID: $2000+/year</li><li>SmartPlant P&amp;ID: $10,000+</li><li><strong>Runiq: Open source!</strong> 🎉</li></ul><h3 id="estimated-effort-3" tabindex="-1">Estimated Effort <a class="header-anchor" href="#estimated-effort-3" aria-label="Permalink to &quot;Estimated Effort&quot;">​</a></h3><p><strong>Total: 3-4 days</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Issue 15-20: More Medium Effort Diagrams</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`markdown</span></span>
<span class="line"><span>## 🎯 Feature: XY Chart / Scatter Plot</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Effort:** 3-5 days</span></span>
<span class="line"><span>**Complexity:** Medium</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Requirements</span></span>
<span class="line"><span>- [ ] 2D coordinate system</span></span>
<span class="line"><span>- [ ] X/Y axes with ticks and labels</span></span>
<span class="line"><span>- [ ] Data point shapes</span></span>
<span class="line"><span>- [ ] Line/curve interpolation</span></span>
<span class="line"><span>- [ ] Legend support</span></span>
<span class="line"><span>- [ ] Multiple data series</span></span>
<span class="line"><span>- [ ] Grid lines</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: Gantt Chart</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Effort:** 3-5 days</span></span>
<span class="line"><span>**Complexity:** Medium</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Requirements</span></span>
<span class="line"><span>- [ ] Timeline layout</span></span>
<span class="line"><span>- [ ] Task bars with durations</span></span>
<span class="line"><span>- [ ] Dependencies (FS, SS, FF, SF)</span></span>
<span class="line"><span>- [ ] Milestones</span></span>
<span class="line"><span>- [ ] Resource assignments</span></span>
<span class="line"><span>- [ ] Critical path highlighting</span></span>
<span class="line"><span>- [ ] Date/time scale</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: Treemap Diagram</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Effort:** 2-4 days (ELK has rectpacking!)</span></span>
<span class="line"><span>**Complexity:** Medium</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Requirements</span></span>
<span class="line"><span>- [x] Enable ELK rectpacking algorithm</span></span>
<span class="line"><span>- [x] Hierarchical nesting</span></span>
<span class="line"><span>- [x] Value-to-area mapping</span></span>
<span class="line"><span>- [x] Color scales</span></span>
<span class="line"><span>- [ ] Hover labels</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: Kanban Board</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Effort:** 3-5 days</span></span>
<span class="line"><span>**Complexity:** Medium</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Requirements</span></span>
<span class="line"><span>- [x] Column layout</span></span>
<span class="line"><span>- [x] Card shapes</span></span>
<span class="line"><span>- [x] WIP limits per column</span></span>
<span class="line"><span>- [x] Swimlanes (optional)</span></span>
<span class="line"><span>- [ ] Card priority indicators</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: Packet Diagram (Network Protocol)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Effort:** 3-4 days</span></span>
<span class="line"><span>**Complexity:** Medium</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Requirements</span></span>
<span class="line"><span>- [ ] Bit-field grid layout</span></span>
<span class="line"><span>- [ ] Byte/bit labels</span></span>
<span class="line"><span>- [ ] Header structure</span></span>
<span class="line"><span>- [ ] Multi-layer protocol stacking</span></span>
<span class="line"><span>- [ ] Bit numbering (0-31, etc.)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: GitGraph</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Effort:** 3-5 days</span></span>
<span class="line"><span>**Complexity:** Medium</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Requirements</span></span>
<span class="line"><span>- [x] Timeline layout</span></span>
<span class="line"><span>- [x] Branch visualization</span></span>
<span class="line"><span>- [x] Commit nodes</span></span>
<span class="line"><span>- [x] Merge indicators</span></span>
<span class="line"><span>- [x] Tag labels</span></span>
<span class="line"><span>- [x] Branch labels</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br></div></div><hr><h2 id="tier-3-high-effort-1-3-weeks-each" tabindex="-1">TIER 3: HIGH EFFORT (1-3 weeks each) <a class="header-anchor" href="#tier-3-high-effort-1-3-weeks-each" aria-label="Permalink to &quot;TIER 3: HIGH EFFORT (1-3 weeks each)&quot;">​</a></h2><h3 id="issue-21-c4-architecture-diagrams" tabindex="-1">Issue 21: C4 Architecture Diagrams <a class="header-anchor" href="#issue-21-c4-architecture-diagrams" aria-label="Permalink to &quot;Issue 21: C4 Architecture Diagrams&quot;">​</a></h3><div class="language-markdown vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang">markdown</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">## 🎯 Feature: C4 Architecture Diagrams</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">### Description</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">Add support for C4 model (Context, Container, Component, Code) architecture diagrams with hierarchical containers.</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">### Current Status</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] C4 shapes, examples, and docs are in place</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">### Implementation Requirements</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}">**Effort:**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> 1-2 weeks  </span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}">**Priority:**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> High (Software architecture standard)  </span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}">**Complexity:**</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> High (needs hierarchical containers)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">#### Phase 1: Hierarchical Containers (1 week)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-light-font-weight": "bold", "--shiki-dark": "#E1E4E8", "--shiki-dark-font-weight": "bold" })}">**This is the critical architecture enhancement!**</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Add container/subgraph support to AST</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Nested container parsing in DSL</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] ELK hierarchical layout</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Container rendering with z-index</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Cross-container edge routing</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">#### Phase 2: C4-Specific Shapes (2 days)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Person (external user)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Software System (high-level)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Container (app, database, etc.)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Component (code module)</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#E36209", "--shiki-dark": "#FFAB70" })}">-</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"> [</span><span style="${ssrRenderStyle({ "--shiki-light": "#032F62", "--shiki-light-text-decoration": "underline", "--shiki-dark": "#DBEDFF", "--shiki-dark-text-decoration": "underline" })}">x</span><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">] Relationship arrows with technology labels</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#005CC5", "--shiki-light-font-weight": "bold", "--shiki-dark": "#79B8FF", "--shiki-dark-font-weight": "bold" })}">#### Phase 3: C4 Levels (2 days)</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">\`\`\`runiq</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"># Level 1: System Context</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">diagram c4-context &quot;Banking System&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  person Customer</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  system BankingSystem</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  system EmailSystem external</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  Customer -&gt; BankingSystem label:&quot;Uses&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  BankingSystem -&gt; EmailSystem label:&quot;Sends emails via&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"># Level 2: Container</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">diagram c4Container &quot;Banking System&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  container WebApp type:web label:&quot;Web Application&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  container API type:api label:&quot;API&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  container DB type:database label:&quot;Database&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  WebApp -&gt; API label:&quot;Makes API calls [HTTPS]&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  API -&gt; DB label:&quot;Reads/Writes [SQL]&quot;</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}"># Level 3: Component</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">diagram c4Component &quot;API Container&quot;</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  component LoginController</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  component SecurityComponent</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  component EmailComponent</span></span>
<span class="line"></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  LoginController -&gt; SecurityComponent</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">  LoginController -&gt; EmailComponent</span></span>
<span class="line"><span style="${ssrRenderStyle({ "--shiki-light": "#24292E", "--shiki-dark": "#E1E4E8" })}">\`\`\`</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br></div></div><h4 id="phase-4-examples-tests-2-days" tabindex="-1">Phase 4: Examples &amp; Tests (2 days) <a class="header-anchor" href="#phase-4-examples-tests-2-days" aria-label="Permalink to &quot;Phase 4: Examples &amp; Tests (2 days)&quot;">​</a></h4><ul><li>[x] System context example</li><li>[x] Container diagram example</li><li>[x] Component diagram example</li><li>[ ] 40+ tests</li></ul><h3 id="acceptance-criteria-4" tabindex="-1">Acceptance Criteria <a class="header-anchor" href="#acceptance-criteria-4" aria-label="Permalink to &quot;Acceptance Criteria&quot;">​</a></h3><ul><li>[x] Hierarchical containers work</li><li>[x] All 4 C4 levels supported</li><li>[x] Technology labels on relationships</li><li>[x] 3+ C4 examples</li><li>[ ] 40+ tests passing</li></ul><h3 id="references" tabindex="-1">References <a class="header-anchor" href="#references" aria-label="Permalink to &quot;References&quot;">​</a></h3><ul><li>C4 Model: <a href="https://c4model.com/" target="_blank" rel="noreferrer">https://c4model.com/</a></li><li>Simon Brown&#39;s architecture diagrams</li></ul><h3 id="estimated-effort-4" tabindex="-1">Estimated Effort <a class="header-anchor" href="#estimated-effort-4" aria-label="Permalink to &quot;Estimated Effort&quot;">​</a></h3><p><strong>Total: 1-2 weeks</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Issue 22: BPMN Support</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`markdown</span></span>
<span class="line"><span>## 🎯 Feature: BPMN (Business Process Model &amp; Notation)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Description</span></span>
<span class="line"><span>Add comprehensive BPMN 2.0 support with pools, lanes, events, tasks, and gateways.</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Current Status</span></span>
<span class="line"><span>- [x] Core BPMN shapes + pools implemented with examples</span></span>
<span class="line"><span>- [ ] Full BPMN 2.0 coverage (subtypes, compliance, validation)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Implementation Requirements</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Effort:** 2-3 weeks</span></span>
<span class="line"><span>**Priority:** High (Industry standard for BPM)</span></span>
<span class="line"><span>**Complexity:** Very High</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Phase 1: BPMN Shape Library (1 week)</span></span>
<span class="line"><span>**60+ Symbols:**</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Events (20 types):**</span></span>
<span class="line"><span>- [x] Start event (plain, message, timer, conditional, signal)</span></span>
<span class="line"><span>- [x] End event (plain, message, terminate, error, cancel)</span></span>
<span class="line"><span>- [x] Intermediate event (message, timer, error, escalation)</span></span>
<span class="line"><span>- [ ] Boundary event (interrupting/non-interrupting)</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Tasks:**</span></span>
<span class="line"><span>- [x] Task (generic)</span></span>
<span class="line"><span>- [ ] User task</span></span>
<span class="line"><span>- [ ] Service task</span></span>
<span class="line"><span>- [ ] Script task</span></span>
<span class="line"><span>- [ ] Business rule task</span></span>
<span class="line"><span>- [ ] Manual task</span></span>
<span class="line"><span>- [ ] Send task</span></span>
<span class="line"><span>- [ ] Receive task</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Gateways:**</span></span>
<span class="line"><span>- [x] Exclusive gateway (XOR)</span></span>
<span class="line"><span>- [x] Parallel gateway (AND)</span></span>
<span class="line"><span>- [x] Inclusive gateway (OR)</span></span>
<span class="line"><span>- [x] Event-based gateway</span></span>
<span class="line"><span>- [x] Complex gateway</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Data:**</span></span>
<span class="line"><span>- [x] Data object</span></span>
<span class="line"><span>- [ ] Data store</span></span>
<span class="line"><span>- [ ] Message flow</span></span>
<span class="line"><span></span></span>
<span class="line"><span>**Artifacts:**</span></span>
<span class="line"><span>- [ ] Text annotation</span></span>
<span class="line"><span>- [ ] Group</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Phase 2: Pools &amp; Lanes (4 days)</span></span>
<span class="line"><span>- [x] Pool container (organization)</span></span>
<span class="line"><span>- [ ] Lane container (role/department)</span></span>
<span class="line"><span>- [ ] Nested lanes</span></span>
<span class="line"><span>- [ ] Message flows between pools</span></span>
<span class="line"><span></span></span>
<span class="line"><span>#### Phase 3: DSL Syntax (3 days)</span></span>
<span class="line"><span>\`\`\`runiq</span></span>
<span class="line"><span>diagram bpmn &quot;Order Process&quot;</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  pool Customer {</span></span>
<span class="line"><span>    start PlaceOrder event:message</span></span>
<span class="line"><span>    task ReviewOrder type:user</span></span>
<span class="line"><span>    gateway Approve type:exclusive</span></span>
<span class="line"><span>    end OrderApproved event:message</span></span>
<span class="line"><span>    end OrderRejected event:message</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    PlaceOrder -&gt; ReviewOrder -&gt; Approve</span></span>
<span class="line"><span>    Approve -&gt; OrderApproved label:&quot;approved&quot;</span></span>
<span class="line"><span>    Approve -&gt; OrderRejected label:&quot;rejected&quot;</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  pool System {</span></span>
<span class="line"><span>    lane Inventory {</span></span>
<span class="line"><span>      receive ReceiveOrder event:message</span></span>
<span class="line"><span>      task CheckStock type:service</span></span>
<span class="line"><span>      task ReserveItems type:service</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>    lane Shipping {</span></span>
<span class="line"><span>      task ShipOrder type:user</span></span>
<span class="line"><span>      end OrderShipped event:message</span></span>
<span class="line"><span>    }</span></span>
<span class="line"><span>  }</span></span>
<span class="line"><span></span></span>
<span class="line"><span>  message Customer.OrderApproved -&gt; System.ReceiveOrder</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br><span class="line-number">55</span><br><span class="line-number">56</span><br><span class="line-number">57</span><br><span class="line-number">58</span><br><span class="line-number">59</span><br><span class="line-number">60</span><br><span class="line-number">61</span><br><span class="line-number">62</span><br><span class="line-number">63</span><br><span class="line-number">64</span><br><span class="line-number">65</span><br><span class="line-number">66</span><br><span class="line-number">67</span><br><span class="line-number">68</span><br><span class="line-number">69</span><br><span class="line-number">70</span><br><span class="line-number">71</span><br><span class="line-number">72</span><br><span class="line-number">73</span><br><span class="line-number">74</span><br><span class="line-number">75</span><br><span class="line-number">76</span><br><span class="line-number">77</span><br><span class="line-number">78</span><br><span class="line-number">79</span><br><span class="line-number">80</span><br><span class="line-number">81</span><br><span class="line-number">82</span><br><span class="line-number">83</span><br><span class="line-number">84</span><br><span class="line-number">85</span><br><span class="line-number">86</span><br><span class="line-number">87</span><br><span class="line-number">88</span><br><span class="line-number">89</span><br><span class="line-number">90</span><br><span class="line-number">91</span><br><span class="line-number">92</span><br></div></div><h4 id="phase-4-validation-2-days" tabindex="-1">Phase 4: Validation (2 days) <a class="header-anchor" href="#phase-4-validation-2-days" aria-label="Permalink to &quot;Phase 4: Validation (2 days)&quot;">​</a></h4><ul><li>[ ] BPMN 2.0 compliance rules</li><li>[ ] Gateway logic validation</li><li>[ ] Message flow validation</li><li>[ ] Pool/lane structure validation</li></ul><h4 id="phase-5-examples-tests-2-days" tabindex="-1">Phase 5: Examples &amp; Tests (2 days) <a class="header-anchor" href="#phase-5-examples-tests-2-days" aria-label="Permalink to &quot;Phase 5: Examples &amp; Tests (2 days)&quot;">​</a></h4><ul><li>[x] Order fulfillment</li><li>[x] Loan approval</li><li>[x] Customer onboarding</li><li>[x] Incident management</li><li>[ ] 60+ tests</li></ul><h3 id="acceptance-criteria-5" tabindex="-1">Acceptance Criteria <a class="header-anchor" href="#acceptance-criteria-5" aria-label="Permalink to &quot;Acceptance Criteria&quot;">​</a></h3><ul><li>[ ] 60+ BPMN symbols</li><li>[ ] Pools and lanes working</li><li>[ ] Message flows</li><li>[ ] BPMN 2.0 compliance</li><li>[ ] Export to BPMN XML (future)</li><li>[x] 5+ example processes</li><li>[ ] 60+ tests passing</li></ul><h3 id="industry-standards-1" tabindex="-1">Industry Standards <a class="header-anchor" href="#industry-standards-1" aria-label="Permalink to &quot;Industry Standards&quot;">​</a></h3><ul><li>BPMN 2.0 (OMG specification)</li><li>BPMN XML interchange format</li></ul><h3 id="market-comparison" tabindex="-1">Market Comparison <a class="header-anchor" href="#market-comparison" aria-label="Permalink to &quot;Market Comparison&quot;">​</a></h3><ul><li>Camunda Modeler: Free (but limited)</li><li>Bizagi: $$$</li><li>Signavio: $$$$</li></ul><h3 id="estimated-effort-5" tabindex="-1">Estimated Effort <a class="header-anchor" href="#estimated-effort-5" aria-label="Permalink to &quot;Estimated Effort&quot;">​</a></h3><p><strong>Total: 2-3 weeks</strong></p><div class="language- vp-adaptive-theme line-numbers-mode"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span></span></span>
<span class="line"><span>---</span></span>
<span class="line"><span></span></span>
<span class="line"><span>### Issue 23-30: Additional High-Effort Diagrams</span></span>
<span class="line"><span></span></span>
<span class="line"><span>Due to length constraints, I&#39;ll provide abbreviated templates for the remaining high-effort items:</span></span>
<span class="line"><span></span></span>
<span class="line"><span>\`\`\`markdown</span></span>
<span class="line"><span>## 🎯 Feature: Sankey Diagram (1-2 weeks)</span></span>
<span class="line"><span>- [x] Flow-proportional edges</span></span>
<span class="line"><span>- [x] Variable-width rendering</span></span>
<span class="line"><span>- [x] Multi-stage flows</span></span>
<span class="line"><span>- [x] Energy/material flow visualization</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: Roadmap Diagram (1-2 weeks)</span></span>
<span class="line"><span>- Timeline + swimlanes</span></span>
<span class="line"><span>- Initiative/epic bars</span></span>
<span class="line"><span>- Dependencies</span></span>
<span class="line"><span>- Milestone markers</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: Wardley Map (1-2 weeks)</span></span>
<span class="line"><span>- [x] 2D evolution/value axes</span></span>
<span class="line"><span>- [x] Component positioning</span></span>
<span class="line"><span>- [x] Value chain connections</span></span>
<span class="line"><span>- [x] Movement indicators</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: Critical Path Analysis (1-2 weeks)</span></span>
<span class="line"><span>- PERT/CPM layout</span></span>
<span class="line"><span>- Duration calculations</span></span>
<span class="line"><span>- Critical path highlighting</span></span>
<span class="line"><span>- Float/slack display</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: Sequential Function Chart (1-2 weeks)</span></span>
<span class="line"><span>- IEC 61131-3 SFC</span></span>
<span class="line"><span>- Step/transition layout</span></span>
<span class="line"><span>- Parallel branches</span></span>
<span class="line"><span>- PLC programming</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: Architecture Tiers (1 week)</span></span>
<span class="line"><span>- Horizontal swim lanes</span></span>
<span class="line"><span>- Layer/tier containers</span></span>
<span class="line"><span>- Cross-layer connections</span></span>
<span class="line"><span>- Common in IT architecture</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: Deployment Diagram (1-2 weeks)</span></span>
<span class="line"><span>- UML deployment nodes</span></span>
<span class="line"><span>- 3D cube shapes</span></span>
<span class="line"><span>- Artifact deployment</span></span>
<span class="line"><span>- Physical topology</span></span>
<span class="line"><span></span></span>
<span class="line"><span>## 🎯 Feature: Hierarchy List (1 week)</span></span>
<span class="line"><span>- Indented tree layout</span></span>
<span class="line"><span>- Expand/collapse indicators</span></span>
<span class="line"><span>- Org chart alternative</span></span></code></pre><div class="line-numbers-wrapper" aria-hidden="true"><span class="line-number">1</span><br><span class="line-number">2</span><br><span class="line-number">3</span><br><span class="line-number">4</span><br><span class="line-number">5</span><br><span class="line-number">6</span><br><span class="line-number">7</span><br><span class="line-number">8</span><br><span class="line-number">9</span><br><span class="line-number">10</span><br><span class="line-number">11</span><br><span class="line-number">12</span><br><span class="line-number">13</span><br><span class="line-number">14</span><br><span class="line-number">15</span><br><span class="line-number">16</span><br><span class="line-number">17</span><br><span class="line-number">18</span><br><span class="line-number">19</span><br><span class="line-number">20</span><br><span class="line-number">21</span><br><span class="line-number">22</span><br><span class="line-number">23</span><br><span class="line-number">24</span><br><span class="line-number">25</span><br><span class="line-number">26</span><br><span class="line-number">27</span><br><span class="line-number">28</span><br><span class="line-number">29</span><br><span class="line-number">30</span><br><span class="line-number">31</span><br><span class="line-number">32</span><br><span class="line-number">33</span><br><span class="line-number">34</span><br><span class="line-number">35</span><br><span class="line-number">36</span><br><span class="line-number">37</span><br><span class="line-number">38</span><br><span class="line-number">39</span><br><span class="line-number">40</span><br><span class="line-number">41</span><br><span class="line-number">42</span><br><span class="line-number">43</span><br><span class="line-number">44</span><br><span class="line-number">45</span><br><span class="line-number">46</span><br><span class="line-number">47</span><br><span class="line-number">48</span><br><span class="line-number">49</span><br><span class="line-number">50</span><br><span class="line-number">51</span><br><span class="line-number">52</span><br><span class="line-number">53</span><br><span class="line-number">54</span><br></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("GITHUB-ISSUES-TEMPLATES.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const GITHUBISSUESTEMPLATES = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  GITHUBISSUESTEMPLATES as default
};
