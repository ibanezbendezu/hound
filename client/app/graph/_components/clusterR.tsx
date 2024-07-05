"use client"

import React, { useState, useEffect } from 'react';
import cytoscape, { Core } from 'cytoscape';
import dagre from "cytoscape-dagre";
import CytoscapeComponent from "react-cytoscapejs";
import cola from 'cytoscape-cola';
import undoRedo from "cytoscape-undo-redo";
import expandCollapse from 'cytoscape-expand-collapse';
import nodeHtmlLabel from "cytoscape-node-html-label";
import contextMenus from "cytoscape-context-menus";

import { color, selector } from "d3";
import {scaleLinear} from 'd3-scale';
import {useFile} from "@/hooks/use-file";
import {useEdge} from "@/hooks/use-edge";

import {c} from "../_components/c";

const data = convertToCytoscape(c)
const elements = [
    ...data.nodes.map(node => ({ data: node.data })),
    ...data.edges.map(edge => ({ data: edge.data }))
];
console.log(elements)

cytoscape.use(dagre);
cytoscape.use(cola);
cytoscape.use(undoRedo);
cytoscape.use(expandCollapse);

declare module 'cytoscape' {
    interface Core {
        expandCollapse: (options: any) => any;
        undoRedo: () => any;
    }
}
const graphStyles = [
    {
        selector: "node",
        style: {
            label: "data(label)",
            color: "#fff",
            backgroundColor: "#363636",
            width: "80px",
            height: "40px",
            shape: "roundrectangle",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "5px",
            "font-weight": "bold",
            "text-margin-y": -10,

            //"text-background-color": "#fff",
            //"text-background-opacity": 1,
            //"text-background-padding": "3px",
            //"text-background-shape": "roundrectangle",
        },
    },
    {
        selector: "node:selected",
        style: {
            "border-width": "1x",
            "border-color": "#fff",
            "border-style": "solid",
            "background-color": "#686767",
        },
    },
    {
        selector: "edge",
        style: {
            width: 1.5,
            color: "#fff",
            label: "data(similarity)",
            "line-color": "data(color)",
            "text-valign": "bottom",
            "font-size": "4px",
            "font-weight": "bold",
            "curve-style": "bezier",
            "source-endpoint": "outside-to-node",
            "target-endpoint": "outside-to-node",
            "text-rotation": "autorotate",

            "text-background-color": "#615B5B",
            "text-background-opacity": 1,
            "text-background-padding": "2px",
            "text-background-shape": "roundrectangle",
        },
    },
    {
        selector: "edge:selected",
        style: {
            "line-color": "#fff",
            "target-arrow-color": "#fff",
            "text-background-color": "data(color)",
        },
    }
] as any;

export const Cluster: React.FC = () => {
    const config = {
        layout: {
            name: "dagre",
        },
        zoom: 1,
    };

    /* useEffect(() => {
        let cy = cytoscape({
            container: document.getElementById("cy"),
            elements: data,
            style: graphStyles,
            layout: config.layout,
            wheelSensitivity: 0.1,
            zoomingEnabled: true,
        });

        cy.zoom(config.zoom);
        cy.center();

    }, []);

    return <div id="cy" style={{height: "100vh", width: "100%"}}/>; */

    const [cy, setCy] = useState<Core | null>(null);
    
    useEffect(() => {
        if (cy) {
            const api = cy.expandCollapse({
                layoutBy: {
                    name: "preset",
                    randomize: false,
                    fit: true,
                },
                fisheye: false,
            });
            
            cy.undoRedo();
            api.collapseAll({ layoutBy: { name: "preset" } });
        }
    }, [cy]);

  return (
    <>
      <CytoscapeComponent
        cy = {(cyInstance) => {
            setCy(cyInstance);
        }}
        layout={config.layout}
        styleEnabled={true}
        stylesheet={graphStyles}
        elements={CytoscapeComponent.normalizeElements(elements)}
        wheelSensitivity={0.1}
        zoomingEnabled={true}
        zoom={1}

        // minZoom={0.1}
        // maxZoom={3}
        style={{height: "100vh", width: "100%"}}
      />
    </>
  );

};


function convertToCytoscape(data: any) {
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
                                similarity: link.similarity,
                                color: colorScale(link.similarity * 100)
                            }
                        });
                    }
                });
            });
        });
    });

    return { nodes, edges };
}