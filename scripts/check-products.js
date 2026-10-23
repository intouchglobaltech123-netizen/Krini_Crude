const fs = require('fs');
const path = require('path');

// We can read src/content/catalogue.ts
// Or inspect what products are passed to ShopClient
const content = fs.readFileSync('src/content/catalogue.ts', 'utf8');

// Let's find every line and every product
const docFiles = fs.existsSync('public/documents') ? fs.readdirSync('public/documents') : [];
console.log('Existing docFiles in public/documents:');
console.log(docFiles);

// Let's check how many products exist
const linesBlock = content.slice(content.indexOf('export const lines: Line[] = ['));
const names = [];
const regex = /name:\s*"([^"]+)"/g;
let match;
while ((match = regex.exec(linesBlock)) !== null) {
  names.push(match[1]);
}
console.log('Found names:', names);
