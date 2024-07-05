import { scaleLinear } from 'd3-scale';

export function convertToCytoscape(data: any) {
    interface NodeData {
        id: string;
        label: string;
        type: string;
        parent?: string;
    }
    
    interface Node {
        data: NodeData;
    }
    
    interface EdgeData {
        edgeId: string;
        source: string;
        target: string;
        sourceName: string;
        targetName: string;
        color: string;
        similarity: number;
    }
    
    interface Edge {
        data: EdgeData;
    }
    
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    const colorScale = scaleLinear<string>().domain([0, 100]).range(["#2E9335", "#B82318"]);

    data.repositories.forEach((repo: any) => {
        nodes.push({
            data: {
                id: `repo-${repo.id}`,
                label: repo.name,
                type: 'repository'
            }
        });

        repo.children.forEach((folder: any) => {
            const folderId = `folder-${repo.id}-${folder.name}`;
            nodes.push({
                data: {
                    id: folderId,
                    label: folder.name,
                    parent: `repo-${repo.id}`,
                    type: 'folder'
                }
            });

            folder.children.forEach((file: any) => {
                const fileId = `file-${file.id}`;
                nodes.push({
                    data: {
                        id: fileId,
                        label: file.name,
                        parent: folderId,
                        type: 'file'
                    }
                });
                
                file.links.forEach((link: any) => {
                    const exist = edges.some((edge) => edge.data.edgeId === `edge-${link.pairId}`);
                    if (!exist) {
                        edges.push({
                            data: {
                                edgeId: `edge-${link.pairId}`,
                                source: fileId,
                                target: `file-${link.pairFileId}`,
                                sourceName: file.name,
                                targetName: link.pairFilePath.split('/').pop(),
                                similarity: parseFloat((link.similarity * 100).toFixed(4)),
                                color: colorScale(link.similarity * 100)
                            },
                        });
                    }
                });
            });
        });
    });

    return { nodes, edges };
}