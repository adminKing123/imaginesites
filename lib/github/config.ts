export function getGitHubUploadConfig() {
  const username = process.env.GITHUB1_USERNAME;
  const repoName = process.env.GITHUB1_REPO_NAME;
  const branchName = process.env.GITHUB1_BRANCH_NAME;
  const token = process.env.GITHUB1_TOKEN;
  const uploadsFolder = process.env.GITHUB1_UPLOADS_FOLDER;

  const missing = [
    !username && "GITHUB1_USERNAME",
    !repoName && "GITHUB1_REPO_NAME",
    !branchName && "GITHUB1_BRANCH_NAME",
    !token && "GITHUB1_TOKEN",
    !uploadsFolder && "GITHUB1_UPLOADS_FOLDER",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Missing GitHub environment variables: ${missing.join(", ")}`);
  }

  return {
    username: username!,
    repoName: repoName!,
    branchName: branchName!,
    token: token!,
    uploadsFolder: uploadsFolder!,
  };
}

export function buildGitHubCdnUrl(
  config: ReturnType<typeof getGitHubUploadConfig>,
  filePath: string,
) {
  return `https://raw.githubusercontent.com/${config.username}/${config.repoName}/${config.branchName}/${filePath}`;
}
