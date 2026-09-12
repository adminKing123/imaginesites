import { buildGitHubCdnUrl, getGitHubUploadConfig } from "./config";

type UploadFileToGitHubInput = {
  fileName: string;
  fileBuffer: Buffer;
  mimeType: string;
};

export async function uploadFileToGitHub({
  fileName,
  fileBuffer,
}: UploadFileToGitHubInput) {
  const config = getGitHubUploadConfig();
  const filePath = `${config.uploadsFolder}/${fileName}`;
  const apiUrl = `https://api.github.com/repos/${config.username}/${config.repoName}/contents/${filePath}`;

  const response = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${config.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message: `Upload ${fileName}`,
      content: fileBuffer.toString("base64"),
      branch: config.branchName,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`GitHub upload failed: ${errorBody}`);
  }

  return {
    filePath,
    cdnUrl: buildGitHubCdnUrl(config, filePath),
  };
}
