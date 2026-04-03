import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"SPICE Netlist Export","description":"","frontmatter":{},"headers":[],"relativePath":"export/spice.md","filePath":"export/spice.md","lastUpdated":1761614486000}');
const _sfc_main = { name: "export/spice.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="spice-netlist-export" tabindex="-1">SPICE Netlist Export <a class="header-anchor" href="#spice-netlist-export" aria-label="Permalink to &quot;SPICE Netlist Export&quot;">​</a></h1><p>Placeholder for SPICE export instructions.</p><ul><li>Supported elements and analysis types</li><li>How to export from CLI and API</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("export/spice.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const spice = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  spice as default
};
