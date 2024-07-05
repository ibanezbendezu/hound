import { Controller, Get, Post, Body, Param } from "@nestjs/common";
import { RepositoriesService } from "./repositories.service";

@Controller("repos")
export class RepositoriesController {

    constructor(private readonly repositoryService: RepositoriesService) {
    }

    @Get(":owner/:name")
    async getRepoContent(@Param("owner") owner: string, @Param("name") name: string, @Body() body: {
        username: string
    }) {
        return await this.repositoryService.getRepositoryContent(owner, name, body.username);
    }

    @Post()
    async getReposContent(@Body() repos: string[], username: string) {
        //return await this.repositoryService.getMultipleReposContent(repos, username);
    }

}