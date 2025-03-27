import { Octokit } from "@octokit/rest";
import { Base64 } from "js-base64";

export class GitHubService {
    private octokit: Octokit;

    constructor(githubToken: string) {
        this.octokit = new Octokit({
            auth: githubToken,
        });
    }

    async createRepo(repoName: string, description: string = 'Generated repository', privateRepo: boolean = false): Promise<boolean> {
        try {
            await this.octokit.rest.repos.createForAuthenticatedUser({
                name: repoName,
                description: description,
                private: privateRepo,
                auto_init: true,
            });
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    async pushFile(owner: string, repo: string, path: string, content: string, message: string): Promise<void> {
        const contentEncoded = Base64.encode(content);
        try {
            await this.octokit.repos.createOrUpdateFileContents({
                owner: owner,
                repo: repo,
                path: path,
                message: message,
                content: contentEncoded,
                committer: {
                    name: "GitHub Bot",
                    email: "bot@example.com",
                },
                author: {
                    name: "GitHub Bot",
                    email: "bot@example.com",
                },
            });
        } catch (err) {
            console.error(err);
        }
    }
}