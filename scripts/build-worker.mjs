import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const content=readFileSync('src/content.js','utf8').split('export function localReply')[0].replaceAll('export const ','const ');
const knowledge=readFileSync('worker/src/knowledge.js','utf8').replace(/^import .*;\n/m,'').replace('export const ','const ');
const worker=readFileSync('worker/src/index.js','utf8').replace(/^import .*;\n/m,'').replaceAll('export function ','function ');
mkdirSync('cloudflare',{recursive:true});
writeFileSync('cloudflare/worker.js','// Generated standalone Worker for Cloudflare Dashboard. No imports or API keys.\n// After editing source business facts, run npm run build:worker and repaste this file.\n'+content+'\n'+knowledge+'\n'+worker);
console.log('Prepared cloudflare/worker.js for the dashboard editor.');
