import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Cluster } from "@prisma/client";
import { RepositoriesService } from "src/repositories/repositories.service";
import { ComparisonsService } from "src/comparisons/comparisons.service";


@Injectable()
export class ClustersService {

    constructor(
        private repository: RepositoriesService,
        private comparisons: ComparisonsService,
        private prisma: PrismaService) {
    }

    async getAllClusters(): Promise<Cluster[]> {
        return this.prisma.cluster.findMany({
            include: {
                comparisons: {
                    select: {
                        repositoryAId: true,
                        repositoryBId: true,
                        pairs: {
                            select: {
                                similarity: true,
                                leftFilepath: true,
                                rightFilepath: true,
                            }
                        }
                    }
                }
            }
        });
    }

    async getClusterById(id: number): Promise<any> {
        const clusterFind = this.prisma.cluster.findUnique({
            where: {
                id: id
            },
            include: {
                comparisons: {
                    select: {
                        id: true,
                        sha: true,
                        similarity: true,
                        comparisonDate: true,

                        repositoryAId: true,
                        repositoryA: {
                            select: {
                                id: true,
                                name: true,
                                owner: true,
                                sha: true,
                            }
                        },
                        repositoryBId: true,
                        repositoryB: {
                            select: {
                                id: true,
                                name: true,
                                owner: true,
                                sha: true,
                            }
                        },
                        pairs: {
                            select: {
                                id: true,
                                similarity: true,
                                leftFilepath: true,
                                lineCountLeft: true,
                                rightFilepath: true,
                                lineCountRight: true,
                                fragments: true,

                                files: {
                                    select: {
                                        filepath: true,
                                        sha: true,
                                        id: true,
                                        lineCount: true,
                                        repositoryId: true,
                                        type: true,
                                        repository: {
                                            select: {
                                                id: true,
                                                name: true,
                                                owner: true,
                                                totalLines: true,
                                                sha: true
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        const cl = await clusterFind;
        const comparisons = cl.comparisons;

        const groupedByRepository = comparisons.reduce((acc, comparison) => {
            comparison.pairs.forEach(pair => {
                let leftFile = pair.files.find(f => f.filepath === pair.leftFilepath);
                let rightFile = pair.files.find(f => f.filepath === pair.rightFilepath);

                pair.files.forEach(file => {
                    const { repositoryId, filepath, repository } = file;
                    if (!acc[repositoryId]) {
                        acc[repositoryId] = {
                            type: "node",
                            class: "repository",
                            name: repository.owner + "/" + repository.name,
                            fever: 0,
                            value: 0,
                            id: repository.id,
                            sha: repository.sha,
                            repo: repository.name,
                            owner: repository.owner,
                            totalLines: 0,
                            edges: [],
                            children: []
                        };
                    }
                    const pathComponents = filepath.split("/");
                    const filename = pathComponents.pop();
                    const folderPath = pathComponents.join("/");

                    let folder = acc[repositoryId].children.find(f => f.folderPath === folderPath);
                    if (!folder) {
                        const fileType = file.type;
                        folder = {
                            type: "node",
                            class: "folder",
                            name: folderPath.split("/").pop(),
                            fever: 0,
                            value: 0,
                            folderType: fileType,
                            folderPath,
                            edges: [],
                            children: []
                        };
                        acc[repositoryId].children.push(folder);
                    }

                    const link = {
                        similarity: pair.similarity,
                        pairFileId: pair.leftFilepath !== filepath ? leftFile.id : rightFile.id,
                        pairFileSha: pair.leftFilepath !== filepath ? leftFile.sha : rightFile.sha,
                        pairFilePath: pair.leftFilepath !== filepath ? pair.leftFilepath : pair.rightFilepath,
                        pairFileType: pair.leftFilepath !== filepath ? leftFile.type : rightFile.type,
                        pairFileLines: pair.leftFilepath !== filepath ? leftFile.lineCount : rightFile.lineCount,
                        pairFileRepository: comparison.repositoryAId === repositoryId ? comparison.repositoryBId : comparison.repositoryAId,
                        pairFileRepositoryName: comparison.repositoryAId === repositoryId ? comparison.repositoryB.name : comparison.repositoryA.name,
                        pairFileRepositoryOwner: comparison.repositoryAId === repositoryId ? comparison.repositoryB.owner : comparison.repositoryA.owner,
                        fragments: pair.fragments,
                        pairId: pair.id
                    };

                    const existingFileIndex = folder.children.findIndex(f => f.filepath === filepath);

                    if (existingFileIndex !== -1) {
                        folder.children[existingFileIndex].links.push(link);
                    } else {
                        folder.children.push({
                            type: "leaf",
                            class: "file",
                            name: filepath.split("/").pop().split(".").shift(),
                            value: file.lineCount,
                            fever: 0,
                            id: file.id,
                            sha: file.sha,
                            filepath,
                            fileType: file.type,
                            lines: file.lineCount,
                            links: [link]
                        });
                    }

                    const edgeIndex = acc[repositoryId].edges.findIndex(e => e.id === link.pairFileRepository);
                    if (edgeIndex === -1) {
                        acc[repositoryId].edges.push({ id: link.pairFileRepository, similarity: link.similarity });
                    } else {
                        acc[repositoryId].edges[edgeIndex].similarity = (acc[repositoryId].edges[edgeIndex].similarity + link.similarity) / 2;
                    }
                });
            });
            return acc;
        }, {});

        const result = {
            id: cl.id,
            date: cl.clusterDate,
            repositories: []
        };
        Object.keys(groupedByRepository).forEach(repositoryId => {
            const repo = groupedByRepository[repositoryId];
            const foldersArray = Object.keys(repo.children).map(folderPath => repo.children[folderPath]);
            repo.children = foldersArray;
            result.repositories.push(repo);
        });

        result.repositories.forEach(repository => {
            let folderEdges = [];
            repository.children = repository.children.filter(folder => {
                
                folder.children.forEach(file => {
                    file.links = file.links.filter(link => {
                        return link.pairFileType === file.fileType;
                    });
                });
                folder.children.map((child) => {
                    let sum = 0;
                    child.links.map((link) => {
                        sum += link.similarity;
                        let repositoryid = folderEdges.find(e => e.id === link.pairFileRepository);
                        if (repositoryid === undefined) {
                            folderEdges.push({id: link.pairFileRepository, similarity: link.similarity});
                        } else {
                            folderEdges.find(e => e.id === link.pairFileRepository).similarity = (folderEdges.find(e => e.id === link.pairFileRepository).similarity + link.similarity) / 2;
                        }
                    });
                    child.fever = sum / child.links.length * 100;
                });
                folder.edges = folderEdges;
                folderEdges = [];

                return folder.folderType === "Controller" || folder.folderType === "Service" || folder.folderType === "Repository";
            });
            repository.totalLines = repository.children.reduce((acc, folder) => {
                return acc + folder.children.reduce((acc, file) => acc + file.value, 0);
            }, 0);
        });

        return result;
    }

    async createCluster(repos: any[], username: string) {
        console.log(repos);
        console.log(username);

        const repositories = await Promise.all(repos.map(async (repo) => {
            return await this.repository.getRepositoryContent(repo.owner, repo.name, username);
        }));

        let cluster = await this.prisma.cluster.create({
            data: {
                clusterDate: new Date()
            }
        });

        for (let i = 0; i < repositories.length; i++) {
            for (let j = i + 1; j < repositories.length; j++) {
                let comparison = await this.comparisons.createComparation(repositories[i], repositories[j], cluster.id);
                cluster = await this.prisma.cluster.update({
                    where: { id: cluster.id },
                    data: {
                        comparisons: { connect: { id: comparison.id } }
                    }
                });
            }
        }

        const newCluster = await this.prisma.cluster.findUnique({
            where: { id: cluster.id },
            include: { comparisons: true }
        });

        return newCluster;
    }
}
