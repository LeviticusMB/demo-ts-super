rm -rf dist/ node_modules/ package-lock.json
npm i && npm exec tsc

node dist/super.js
open super.html

