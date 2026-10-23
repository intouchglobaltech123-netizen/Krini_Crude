const fs = require('fs');

const content = fs.readFileSync('src/content/catalogue.ts', 'utf8');

// Parse products and ranges
// A quick regex to find all products and their lines
const docFiles = fs.readdirSync('public/documents');

function slugOf(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

console.log('docFiles:');
console.log(docFiles);
