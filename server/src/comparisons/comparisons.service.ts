import { Injectable } from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { RepositoriesService } from "src/repositories/repositories.service";
import { Dolos, Report } from "src/dolos";
import { FileString } from "../types";
import { Comparison } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { RepositoryDto as Repo } from "./dto/repo";


@Injectable()
export class ComparisonsService {

    constructor(
        private user: UsersService,
        private repository: RepositoriesService,
        private prisma: PrismaService) {
    }

    async createComparation(leftRepository: any, rightRepository: any, clusterId: number) {
        try {
            const dolosFile = new Dolos();

            const leftRepoFiles = await dolosFile.stringsToFiles(leftRepository.content);
            const righRepoFiles = await dolosFile.stringsToFiles(rightRepository.content);

            const sortStrings = [leftRepository.sha, rightRepository.sha].sort();
            const sha = sortStrings.join("");

            const c = await this.prisma.comparison.findUnique({ where: { sha: sha } });
            if (c) {
                return c;
            }

            let repositoryA = await this.prisma.repository.findUnique({ where: { sha: leftRepository.sha } });
            if (!repositoryA) {
                repositoryA = await this.prisma.repository.create({
                    data: {
                        sha: leftRepository.sha,
                        owner: leftRepository.owner,
                        name: leftRepository.name,
                        totalLines: 0
                    }
                });
            }

            let repositoryB = await this.prisma.repository.findUnique({ where: { sha: rightRepository.sha } });
            if (!repositoryB) {
                repositoryB = await this.prisma.repository.create({
                    data: {
                        sha: rightRepository.sha,
                        owner: rightRepository.owner,
                        name: rightRepository.name,
                        totalLines: 0
                    }
                });
            }

            let comparison = await this.prisma.comparison.create({
                data: {
                    sha: sha,
                    similarity: 0.0,
                    comparisonDate: new Date(),
                    repositoryAId: repositoryA.id,
                    repositoryBId: repositoryB.id,
                    clusterId: clusterId,
                }
            });

            repositoryA = await this.prisma.repository.update({
                where: { id: repositoryA.id },
                data: {
                    comparisonsA: { connect: { id: comparison.id } }
                }
            });

            repositoryB = await this.prisma.repository.update({
                where: { id: repositoryB.id },
                data: {
                    comparisonsB: { connect: { id: comparison.id } }
                }
            });

            console.log("Comparing repositories: ", leftRepository.name, rightRepository.name);

            let pair = null;

            for (let i = 0; i < leftRepoFiles.length; i++) {
                let fileA = await this.prisma.file.findUnique({
                    where: {
                        sha: leftRepoFiles[i].sha
                    }
                });
                if (!fileA) {
                    let fileType = this.identifyFileType(leftRepoFiles[i].content);
                    fileA = await this.prisma.file.create({
                        data: {
                            sha: leftRepoFiles[i].sha,
                            filepath: leftRepoFiles[i].path,
                            charCount: leftRepoFiles[i].charCount,
                            lineCount: leftRepoFiles[i].lineCount,
                            repository: { connect: { id: repositoryA.id } },
                            type: fileType
                        }
                    });
                    repositoryA = await this.prisma.repository.update({
                        where: { id: repositoryA.id },
                        data: {
                            totalLines: repositoryA.totalLines + fileA.lineCount,
                            files: { connect: { id: fileA.id } }
                        }
                    });
                }
                for (let j = 0; j < righRepoFiles.length; j++) {

                    let fileB = await this.prisma.file.findUnique({
                        where: {
                            sha: righRepoFiles[j].sha
                        }
                    });

                    if (!fileB) {
                        let fileType = this.identifyFileType(righRepoFiles[j].content);
                        fileB = await this.prisma.file.create({
                            data: {
                                sha: righRepoFiles[j].sha,
                                filepath: righRepoFiles[j].path,
                                charCount: righRepoFiles[j].charCount,
                                lineCount: righRepoFiles[j].lineCount,
                                repository: { connect: { id: repositoryB.id } },
                                type: fileType
                            }
                        });

                        repositoryB = await this.prisma.repository.update({
                            where: { id: repositoryB.id },
                            data: {
                                totalLines: repositoryB.totalLines + fileB.lineCount,
                                files: { connect: { id: fileB.id } }
                            }
                        });
                    }
                    console.log("Comparing files: ", leftRepoFiles[i].path, righRepoFiles[j].path);

                    const dolos = new Dolos();
                    const result = await dolos.analyze([leftRepoFiles[i], righRepoFiles[j]]);

                    pair = await this.prisma.pair.create({
                        data: {
                            similarity: result.allPairs()[0].similarity,

                            leftFilepath: result.allPairs()[0].leftFile.path,
                            charCountLeft: result.allPairs()[0].leftFile.charCount,
                            lineCountLeft: result.allPairs()[0].leftFile.lineCount,

                            rightFilepath: result.allPairs()[0].rightFile.path,
                            charCountRight: result.allPairs()[0].rightFile.charCount,
                            lineCountRight: result.allPairs()[0].rightFile.lineCount,

                            files: { connect: [{ id: fileA.id }, { id: fileB.id }] },
                            comparisonId: comparison.id
                        }
                    });

                    let bf = result.allPairs()[0].buildFragments()[0]
                    if (bf) {
                        let left = result.allPairs()[0].buildFragments()[0].leftSelection;
                        let right = result.allPairs()[0].buildFragments()[0].rightSelection;

                        let fragments = await this.prisma.fragment.create({
                            data: {
                                leftstartRow: left.startRow,
                                leftendRow: left.endRow,
                                leftstartCol: left.startCol,
                                leftendCol: left.endCol,
                                rightstartRow: right.startRow,
                                rightendRow: right.endRow,
                                rightstartCol: right.startCol,
                                rightendCol: right.endCol,
                                pair: { connect: { id: pair.id } }                                
                            }
                        });
                    }
                }
            }
            console.log("---------------------------------");
            return comparison;
        } catch (error) {
            console.log(error);
        }
    }

    identifyFileType(fileContent: string): string {
        // Patrones para identificar cada tipo
        const controllerPattern = /@Controller|\@GetMapping|\@PostMapping|\@DeleteMapping|\@PutMapping/;
        const servicePattern = /@Service|\@Injectable/;
        const repositoryPattern = /@Repository|findById\(|save\(/;
        const entityPattern = /@Entity/;

        // Verificar si el contenido coincide con alguno de los patrones
        if (controllerPattern.test(fileContent)) {
            return "Controller";
        } else if (servicePattern.test(fileContent)) {
            return "Service";
        } else if (repositoryPattern.test(fileContent)) {
            return "Repository";
        } else if (entityPattern.test(fileContent)) {
            return "Entity";
        }

        return "Unknown"; // Si no coincide con ningún patrón
    }

    /* async compareRepositories(leftRepository, rightRepository) {
        try {
            const dolosFile = new Dolos();

            const leftRepoFiles = await dolosFile.stringsToFiles(leftRepository.content);
            const righRepoFiles = await dolosFile.stringsToFiles(rightRepository.content);

            const sortStrings = [leftRepository.sha, rightRepository.sha].sort();
            const sha = sortStrings.join("");

            const c = await this.prisma.comparison.findUnique({ where: { sha: sha } });
            if (c) {
                return c;
            }

            let repositoryA = await this.prisma.repository.findUnique({ where: { sha: leftRepository.sha } });
            if (!repositoryA) {
                repositoryA = await this.prisma.repository.create({
                    data: {
                        sha: leftRepository.sha,
                        owner: leftRepository.owner,
                        name: leftRepository.name,
                        totalLines: 0
                    }
                });
            }

            let repositoryB = await this.prisma.repository.findUnique({ where: { sha: rightRepository.sha } });
            if (!repositoryB) {
                repositoryB = await this.prisma.repository.create({
                    data: {
                        sha: rightRepository.sha,
                        owner: rightRepository.owner,
                        name: rightRepository.name,
                        totalLines: 0
                    }
                });
            }

            let comparison = await this.prisma.comparison.create({
                data: {
                    sha: sha,
                    similarity: 0.0,
                    comparisonDate: new Date(),
                    repositoryAId: repositoryA.id,
                    repositoryBId: repositoryB.id
                }
            });

            let pair = null;
            let fileA = null;

            for (let i = 0; i < leftRepoFiles.length; i++) {
                fileA = await this.prisma.file.create({
                    data: {
                        sha: leftRepoFiles[i].sha,
                        filepath: leftRepoFiles[i].path,
                        charCount: leftRepoFiles[i].charCount,
                        lineCount: leftRepoFiles[i].lineCount,
                        repository: { connect: { id: repositoryA.id } }
                    }
                });
                repositoryA = await this.prisma.repository.update({
                    where: { id: repositoryA.id },
                    data: {
                        totalLines: repositoryA.totalLines + fileA.lineCount,
                        files: { connect: { id: fileA.id } }
                    }
                });

                for (let j = 0; j < righRepoFiles.length; j++) {

                    let fileB = await this.prisma.file.findUnique({
                        where: {
                            sha: righRepoFiles[j].sha
                        }
                    });

                    if (!fileB) {
                        fileB = await this.prisma.file.create({
                            data: {
                                sha: righRepoFiles[j].sha,
                                filepath: righRepoFiles[j].path,
                                charCount: righRepoFiles[j].charCount,
                                lineCount: righRepoFiles[j].lineCount,
                                repository: { connect: { id: repositoryB.id } }
                            }
                        });

                        repositoryB = await this.prisma.repository.update({
                            where: { id: repositoryB.id },
                            data: {
                                totalLines: repositoryB.totalLines + fileB.lineCount,
                                files: { connect: { id: fileB.id } }
                            }
                        });
                    }

                    const dolos = new Dolos();
                    const result = await dolos.analyze([leftRepoFiles[i], righRepoFiles[j]]);

                    for (let p of result.allPairs()) {
                        pair = await this.prisma.pair.create({
                            data: {
                                similarity: result.allPairs()[0].similarity,

                                leftFilepath: result.allPairs()[0].leftFile.path,
                                charCountLeft: result.allPairs()[0].leftFile.charCount,
                                lineCountLeft: result.allPairs()[0].leftFile.lineCount,

                                rightFilepath: result.allPairs()[0].rightFile.path,
                                charCountRight: result.allPairs()[0].rightFile.charCount,
                                lineCountRight: result.allPairs()[0].rightFile.lineCount,

                                files: { connect: [{ id: fileA.id }, { id: fileB.id }] }
                            }
                        });
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    } */


    async getAllComparisons(): Promise<Comparison[]> {
        return this.prisma.comparison.findMany({
            include: {
                repositoryA: {
                    include: {
                        comparisonsA: true,
                        comparisonsB: true,
                        files: {
                            include: {
                                pairs: {
                                    include: {
                                        fragments: true
                                    }
                                }
                            }
                        }
                    }
                },
                repositoryB: {
                    include: {
                        comparisonsA: true,
                        comparisonsB: true,
                        files: {
                            include: {
                                pairs: {
                                    include: {
                                        fragments: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
    }

}