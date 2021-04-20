import fetch from "node-fetch";

const urlRegex = /^https:\/\/github.com\/([\w-]+)\/([\w-]+)(?:\/(tree|blob)\/([\w-]+)\/(.*))?$/;

export function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/*
 * Parse github url into individual components.
 */
export function parse(url) {
  const match = url.match(urlRegex);
  if (!match) {
    console.log(`Invalid repo url: ${url}`);
    process.exit(1);
  }
  let [_, owner, repo, treeOrBlob, branch, path] = match;

  path = path ? removeTrailingSlash(path) : null;
  branch = branch || "master";
  let type;
  if (!path) {
    type = "repo";
  } else if (treeOrBlob === "blob") {
    type = "file";
  } else if (treeOrBlob === "tree") {
    type = "folder";
  } else {
    throw new Error(`error parsing url: ${url}`);
  }
  return { owner, repo, branch, path, type };
}

/*
 * Create Github issue.
 * https://docs.github.com/rest/reference/issues#create-an-issue
 */
export async function createIssue(owner, repo, title, body) {
  await fetch(`https://api.github.com/repos/${owner}/${repo}/issues`, {
    method: "post",
    body: JSON.stringify({ title, body }),
    headers: {
      "Content-Type": "application/json",
      Authorization: `token ${process.env.TOKEN}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.id) {
        console.log(`Issue created at ${data.url}`);
      } else {
        console.log(`Something went wrong. Response: ${JSON.stringify(data)}`);
      }
    });
}
