import { Injectable } from "@nestjs/common";
import { Octokit } from "@octokit/rest";
import { UsersService } from "src/users/users.service";
import { Repository } from "@prisma/client";

@Injectable()
export class RepositoriesService {
    private octokit: Octokit;

    constructor(
        private user: UsersService) {
    }

    async getRepositoryContent(owner: string, name: string, username: string) {
        const user_token = await this.user.getUserToken(username);
        const token = user_token || process.env.GITHUB_TOKEN;

        this.octokit = new Octokit({ auth: token });

        try {
            const sha = await this.octokit.repos.getBranch({
                owner,
                repo: name,
                branch: "master"
            });

            const { data } = await this.octokit.git.getTree({
                owner,
                repo: name,
                tree_sha: sha.data.commit.sha,
                recursive: "1"
            });

            const files = data.tree.filter(item => item.type === "blob" && item.path.startsWith("src/main/java/"));

            const fileContents = await Promise.all(files.map(async (file) => {
                const content = await this.getFileContent(owner, name, file.sha);
                return { path: file.path, sha: file.sha, content };
            }));

            return {
                sha: data.sha,
                name,
                owner,
                content: fileContents
            };

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    private async getFileContent(owner: string, repo: string, file_sha: string) {
        const { data } = await this.octokit.git.getBlob({
            owner,
            repo,
            file_sha
        });

        return Buffer.from(data.content, "base64").toString("utf-8");
    }

}