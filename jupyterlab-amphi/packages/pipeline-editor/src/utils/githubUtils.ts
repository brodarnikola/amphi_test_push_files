import { Octokit } from "@octokit/rest";
import { Base64 } from "js-base64";

export const createOrUpdateFile = async (
  token: string,
  owner: string,
  repo: string,
  path: string,
  message: string,
  content: string
) => {
  const octokit = new Octokit({ auth: token });
  const contentEncoded = Base64.encode(content);

  try {
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message,
      content: contentEncoded,
      committer: {
        name: "Your Name",
        email: "your-email@example.com",
      },
      author: {
        name: "Your Name",
        email: "your-email@example.com",
      },
    });
    return data;
  } catch (err) {
    console.error("Error creating or updating file:", err);
    throw err;
  }
};

export const createRepo = async (octokit: Octokit, username: string, repoName?: string) => {
  try {
    await octokit.rest.repos.createForAuthenticatedUser({
      name: repoName || generateUniqueName(username),
      description: "Your repository generated using the pipeline editor",
      private: false,
      auto_init: true,
    });
    return true;
  } catch (err) {
    console.error("Error creating repository:", err);
    return false;
  }
};

const generateUniqueName = (baseName: string) => {
  return `${baseName}-${Date.now()}`;
};