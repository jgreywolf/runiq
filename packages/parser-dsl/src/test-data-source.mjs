import { parse } from '../dist/index.js';

const input = `
  diagram "test" {
    datasource "json" key:users from:"data/users.json"
  }
`;

const result = parse(input);
console.log('Success:', result.success);
console.log('Errors:', result.errors);
console.log('Has document:', !!result.document);
if (result.document) {
  console.log('Profiles count:', result.document.profiles.length);
  if (result.document.profiles.length > 0) {
    const profile = result.document.profiles[0];
    console.log('Profile name:', profile.name);
    console.log('Data sources:', profile.dataSources);
    console.log('Data templates:', profile.dataTemplates);
  }
}
