import { parse } from '../dist/index.js';

const input = `
diagram "test" {
  template "chart" from:mydata {
    node \${item.id} shape:pieChart data:{amount:\${item.amount}}
  }
}
`;

const result = parse(input);

console.log('Success:', result.success);
console.log('Errors:', result.errors);
console.log('Profiles count:', result.document?.profiles.length);

if (result.document?.profiles[0]) {
  const profile = result.document.profiles[0];
  console.log('Profile name:', profile.name);
  console.log('Data templates:', profile.dataTemplates);
}
