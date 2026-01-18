const fs = require('fs');
const packageJson = require('./package.json');
const manifestPath = './manifest.json';

const manifest = require(manifestPath);
manifest.version = packageJson.version;

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`Updated manifest.json to version ${packageJson.version}`);