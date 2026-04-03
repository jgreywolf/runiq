import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import { _ as _export_sfc } from "./plugin-vue_export-helper.1tPrXgE0.js";
const __pageData = JSON.parse('{"title":"Simulink Export","description":"","frontmatter":{},"headers":[],"relativePath":"export/simulink.md","filePath":"export/simulink.md","lastUpdated":1769204262000}');
const _sfc_main = { name: "export/simulink.md" };
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)}><h1 id="simulink-export" tabindex="-1">Simulink Export <a class="header-anchor" href="#simulink-export" aria-label="Permalink to &quot;Simulink Export&quot;">​</a></h1><p>Placeholder for Simulink export instructions.</p><ul><li>Control system block diagram export examples (diagram profile)</li></ul></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("export/simulink.md");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const simulink = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  __pageData,
  simulink as default
};
