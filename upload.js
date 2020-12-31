#!/usr/bin/env node

import * as fs from "fs";
import { createIssue, parse } from "./lib.js";

const [, , issuesFile, repoUrl] = process.argv;

if (issuesFile === undefined || repoUrl === undefined) {
  console.log("Usage: TOKEN=xyz ./upload.js <issues_file> <target_repo_url>");
  process.exit(1);
}

const issues = JSON.parse(fs.readFileSync(issuesFile));
const { owner, repo } = parse(repoUrl);

for (const issue of issues) {
  console.log(issue.number);
  createIssue(owner, repo, issue.title, issue.body);
}
