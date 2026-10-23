import fs from 'node:fs';
import path from 'node:path';

// Let's read catalogue.ts and extract lines, products, ranges
const catalogueContent = fs.readFileSync('src/content/catalogue.ts', 'utf8');

// We can extract every product that has a name
// Or better: let's inspect the catalogue.ts lines structure
console.log('Inspecting shop items...');
