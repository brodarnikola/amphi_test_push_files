import { Octokit } from "@octokit/rest";

export class AuthService {
    private octokit: Octokit;

    constructor(githubAccessToken: string) {
        this.octokit = new Octokit({
            auth: githubAccessToken,
        });
    }

    public async createOrUpdateFile(owner: string, repo: string, path: string, content: string, message: string) {
        const contentEncoded = Buffer.from(content).toString('base64');

        try {
            const { data } = await this.octokit.repos.createOrUpdateFileContents({
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
        } catch (error) {
            console.error("Error creating or updating file:", error);
            throw error;
        }
    }

    public async createRepo(username: string, repoName?: string) {
        try {
            await this.octokit.rest.repos.createForAuthenticatedUser({
                name: repoName || this.generateUniqueName(username),
                description: 'Repository created programmatically',
                private: false,
                auto_init: true,
            });
            return true;
        } catch (error) {
            console.error("Error creating repository:", error);
            return false;
        }
    }

    private generateUniqueName(username: string): string {
        return `${username}-repo-${Date.now()}`;
    }
}