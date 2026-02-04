export function renderDefs(): string {
  let defs = '';
  defs += '<defs>';
  defs += '<style type="text/css"><![CDATA[';
  defs += '.runiq-node-text { font-family: sans-serif; font-size: 14px; }';
  defs += '.runiq-edge-text { font-family: sans-serif; font-size: 12px; }';
  defs +=
    '.runiq-container-label { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #666; }';
  defs += ']]></style>';
  defs += '</defs>';
  return defs;
}
