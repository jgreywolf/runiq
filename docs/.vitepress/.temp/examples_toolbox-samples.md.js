import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Toolbox Samples","description":"","frontmatter":{"title":"Toolbox Samples"},"headers":[],"relativePath":"examples/toolbox-samples.md","filePath":"examples/toolbox-samples.md","lastUpdated":1769204262000}');
const _sfc_main = { name: "examples/toolbox-samples.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="toolbox-samples" tabindex="-1">Toolbox Samples <a class="header-anchor" href="#toolbox-samples" aria-label="Permalink to &quot;Toolbox Samples&quot;">​</a></h1><p>This page showcases a variety of diagrams similar to the samples available in the Editor toolbox. Explore these to learn syntax patterns and rendering results.</p><ul><li>Flowcharts — see <a href="/examples/flowcharts">Flowcharts</a></li><li>Use Case Diagrams — see <a href="/examples/use-case">Use Case</a></li><li>Container Diagrams — see <a href="/examples/containers">Containers</a></li><li>Control Logic Diagrams — see <a href="/examples/control-diagrams">Control Logic Diagrams</a></li><li>Electrical — see <a href="/examples/electrical">Electrical</a></li><li>Digital Logic — see <a href="/examples/digital">Digital</a></li></ul><p>Source of inspiration: <code>apps/editor/src/lib/data/toolbox-data.ts</code> and other sample data modules.</p></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("examples/toolbox-samples.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const toolboxSamples = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  toolboxSamples as default
};
