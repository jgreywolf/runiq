import { parse } from './dist/index.js';

const dsl = `diagram "test"
style myStyle fill: "#ff0000" stroke: "#000000" strokeWidth: 2 fontSize: 14 fontFamily: "Arial"`;

const result = parse(dsl);

console.log('Success:', result.success);
if (!result.success) {
  console.log('Errors:', JSON.stringify(result.errors, null, 2));
} else {
  console.log('Styles:', JSON.stringify(result.diagram?.styles, null, 2));
}
