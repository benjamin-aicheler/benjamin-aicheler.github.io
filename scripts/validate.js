const fs = require('fs');
const path = require('path');

const WORKSPACE_DIR = path.resolve(__dirname, '..');
const indexHtmlPath = path.join(WORKSPACE_DIR, 'index.html');

console.log('Validating index.html existence...');
if (!fs.existsSync(indexHtmlPath)) {
  console.error('FAIL: index.html does not exist!');
  process.exit(1);
}
console.log('OK: index.html exists.');

const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

// Check for CSS reference
console.log('Checking for style.css reference...');
if (!htmlContent.includes('href="style.css"')) {
  console.error('FAIL: style.css is not correctly referenced in index.html!');
  process.exit(1);
}
console.log('OK: style.css reference found.');

// Check for JS reference
console.log('Checking for main.js reference...');
if (!htmlContent.includes('src="main.js"')) {
  console.error('FAIL: main.js is not correctly referenced in index.html!');
  process.exit(1);
}
console.log('OK: main.js reference found.');

// Check for style.css file existence
const styleCssPath = path.join(WORKSPACE_DIR, 'style.css');
console.log('Checking style.css existence...');
if (!fs.existsSync(styleCssPath)) {
  console.error('FAIL: style.css does not exist!');
  process.exit(1);
}
console.log('OK: style.css exists.');

// Check for main.js file existence
const mainJsPath = path.join(WORKSPACE_DIR, 'main.js');
console.log('Checking main.js existence...');
if (!fs.existsSync(mainJsPath)) {
  console.error('FAIL: main.js does not exist!');
  process.exit(1);
}
console.log('OK: main.js exists.');

// Check for .nojekyll existence
const noJekyllPath = path.join(WORKSPACE_DIR, '.nojekyll');
console.log('Checking .nojekyll existence...');
if (!fs.existsSync(noJekyllPath)) {
  console.error('FAIL: .nojekyll does not exist!');
  process.exit(1);
}
console.log('OK: .nojekyll exists.');

// Simple HTML check - tags balancing
console.log('Checking basic HTML syntax (open/close tags)...');
const openDivs = (htmlContent.match(/<div/g) || []).length;
const closeDivs = (htmlContent.match(/<\/div>/g) || []).length;
console.log(`Divs - Open: ${openDivs}, Close: ${closeDivs}`);
if (openDivs !== closeDivs) {
  console.warn(`WARNING: Div tags are unbalanced. Open: ${openDivs}, Close: ${closeDivs}`);
}

const openSections = (htmlContent.match(/<section/g) || []).length;
const closeSections = (htmlContent.match(/<\/section>/g) || []).length;
console.log(`Sections - Open: ${openSections}, Close: ${closeSections}`);
if (openSections !== closeSections) {
  console.error(`FAIL: Section tags are unbalanced. Open: ${openSections}, Close: ${closeSections}`);
  process.exit(1);
}

// Simple JS syntax check
try {
  console.log('Checking main.js syntax by parsing it...');
  const jsContent = fs.readFileSync(mainJsPath, 'utf8');
  new Function(jsContent);
  console.log('OK: main.js parsing succeeded (no syntax errors).');
} catch (e) {
  console.error('FAIL: main.js contains syntax errors!', e.message);
  process.exit(1);
}

console.log('ALL CHECKS PASSED SUCCESSFULLY!');
