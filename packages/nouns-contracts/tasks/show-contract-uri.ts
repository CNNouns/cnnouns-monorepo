import fs from 'fs';
import { task } from 'hardhat/config';

export function getContractURI(): string {
  const data = JSON.parse(fs.readFileSync(`${__dirname}/../contract-uri.json`, { encoding: 'utf-8' }));
  const b64 = Buffer.from(JSON.stringify(data)).toString('base64');
  return `data:application/json;base64,${b64}`;
}

task('show-contract-uri', 'Show base64 encoded contractURI string').setAction(async ({}, {}) => {
  console.log(getContractURI());
});
