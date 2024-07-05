"use client"

import React from "react";
import {useEffect} from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import CytoscapeComponent from "react-cytoscapejs";
import cola from 'cytoscape-cola';
import undoRedo from "cytoscape-undo-redo";
import expandCollapse from "cytoscape-expand-collapse";
import nodeHtmlLabel from "cytoscape-node-html-label";
import contextMenus from "cytoscape-context-menus";

import {scaleLinear} from 'd3-scale';
import {useFile} from "@/hooks/use-file";
import {useEdge} from "@/hooks/use-edge";

import {f} from "../_components/f";
import { color, selector } from "d3";

const colorScale = scaleLinear<string>().domain([0, 100]).range(["#2E9335", "#B82318"]);

cytoscape.use(dagre);
cytoscape.use(cola);
cytoscape.use(undoRedo);
cytoscape.use(expandCollapse);
cytoscape.use(nodeHtmlLabel);

const data = transformToFcytoscapeFormat(f)

const graphStyles = [
    {
        selector: "node",
        style: {
            label: "data(name)",
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

const File = () => {    
    const file = useFile();
    const edge = useEdge();

    const handleFile = (f: any) => {
        file.addFile(f);
        file.onOpen();
    }

    const handleEdge = (e: any) => {
        edge.addEdge(e);
        edge.onOpen();
    }

    const config = {
        layout: {
            name: "dagre",
        },
        zoom: 2,
    };

    useEffect(() => {
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

        cy.on("click", "node", (e) => { handleFile(e.target.data()); } );
        cy.on("click", "edge", (e) => { handleEdge(e.target.data()); } );
    }, []);

    return <div id="cy" style={{height: "100vh", width: "100%"}}/>;

};

export default File;

function transformToFcytoscapeFormat(f: any) {
    const nodes = [
        { data: { id: f.id, name: f.name, lines: f.lines } }
    ];

    const edges = f.links.map((link: any) => ({
        data: {
            pairId: link.pairId,
            source: f.id,
            sorceName: f.name,
            target: link.pairFileId,
            targetName: link.pairFilePath.split('/').pop(),
            similarity: parseFloat(link.similarity.toFixed(4)) * 100,
            color: colorScale(link.similarity * 100)
        }
    }));

    f.links.forEach((link: any) => {
        nodes.push({
            data: {
                id: link.pairFileId,
                name: link.pairFilePath.split('/').pop(),
                lines: link.pairFileLines
            }
        });
    });

    return { nodes, edges };
};