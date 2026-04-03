import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Verilog HDL Export","description":"","frontmatter":{},"headers":[],"relativePath":"export/verilog.md","filePath":"export/verilog.md","lastUpdated":1761614486000}');
const _sfc_main = { name: "export/verilog.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="verilog-hdl-export" tabindex="-1">Verilog HDL Export <a class="header-anchor" href="#verilog-hdl-export" aria-label="Permalink to &quot;Verilog HDL Export&quot;">​</a></h1><p>Placeholder for Verilog export instructions.</p><ul><li>Supported digital components</li><li>Export steps (CLI/API)</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("export/verilog.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const verilog = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  verilog as default
};
