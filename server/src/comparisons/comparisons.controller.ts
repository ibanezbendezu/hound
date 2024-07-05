import { Controller, Get, Post, Body } from "@nestjs/common";
import { ComparisonsService } from "./comparisons.service";
import { RepositoryDto as Repo } from "./dto/repo";

@Controller("comparisons")
export class ComparisonsController {

    constructor(private readonly comparisonService: ComparisonsService) {
    }

    @Get()
    async getAllComparisons() {
        return await this.comparisonService.getAllComparisons();
    }
}
