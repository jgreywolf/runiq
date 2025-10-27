export function renderDefs(): string {
  let defs = '';
  defs += '<defs>';
  defs += '<style type="text/css"><![CDATA[';
  defs += '.runiq-node-text { font-family: sans-serif; font-size: 14px; }';
  defs += '.runiq-edge-text { font-family: sans-serif; font-size: 12px; }';
  defs +=
    '.runiq-container-label { font-family: sans-serif; font-size: 16px; font-weight: bold; fill: #666; }';
  defs += ']]></style>';
  defs +=
    '<pattern id="pedigree-half-fill" width="40" height="40" patternUnits="userSpaceOnUse">';
  defs += '<rect x="0" y="0" width="20" height="40" fill="#000"/>';
  defs += '<rect x="20" y="0" width="20" height="40" fill="#fff"/>';
  defs += '</pattern>';
  defs += '</defs>';
  return defs;
}
