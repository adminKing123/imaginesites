import { getGitHubUploadConfig } from "./config";
import { getGitHubFile } from "./get-file";

export async function deleteGitHubFile(filePath: string) {
  const config = getGitHubUploadConfig();
  const { sha } = await getGitHubFile(filePath);
  const apiUrl = `https://api.github.com/repos/${config.username}/${config.repoName}/contents/${filePath}`;

  const response = await fetch(apiUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message: `Delete ${filePath}`,
      sha,
      branch: config.branchName,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub delete failed: ${errorBody}`);
  }
}
