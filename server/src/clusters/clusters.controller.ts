import { Controller, Get, Post, Body, Param, NotFoundException } from "@nestjs/common";
import { ClustersService } from "./clusters.service";
import { RepositoryDto as Repo } from "../comparisons/dto/repo";

@Controller("clusters")
export class ClustersController {

    constructor(private readonly clustersService: ClustersService) {
    }

    @Get()
    async getAllClusters() {
        return await this.clustersService.getAllClusters();
    }

    @Get(":id")
    async getClusterById(@Param("id") id: string) {
        const clusterFound = await this.clustersService.getClusterById(Number(id));
        if (!clusterFound) throw new NotFoundException("Cluster not found");
        return clusterFound;
    }

    @Post()
    async createCluster(@Body() body: { repos: any[], username: string }) {
        const clusterCreated = await this.clustersService.createCluster(body.repos, body.username);
        if (!clusterCreated) throw new NotFoundException("Cluster not created");
        return clusterCreated;
    }
}
