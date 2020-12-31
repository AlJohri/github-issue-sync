#!/usr/bin/env node

import fetch from "node-fetch";
import { parse } from "./lib.js";
import * as fs from "fs";

const [, , repoUrl] = process.argv;

if (repoUrl === undefined) {
  console.log("Usage: ./download.js <repo_url>");
  process.exit(1);
}

async function main() {
  console.log(repoUrl);
  const { owner, repo } = parse(repoUrl);
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`
  );
  const data = await response.json();
  fs.writeFileSync(`${owner}-${repo}-issues.json`, JSON.stringify(data));
}

(async () => {
  await main();
})().catch((e) => {
  console.error(e);
});
