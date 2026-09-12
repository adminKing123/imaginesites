import { getGitHubUploadConfig } from "./config";

type GitHubFileResponse = {
  sha: string;
};

export async function getGitHubFile(filePath: string) {
  const config = getGitHubUploadConfig();
  const apiUrl = `https://api.github.com/repos/${config.username}/${config.repoName}/contents/${filePath}?ref=${config.branchName}`;

  const response = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub file lookup failed: ${errorBody}`);
  }

  return (await response.json()) as GitHubFileResponse;
}
