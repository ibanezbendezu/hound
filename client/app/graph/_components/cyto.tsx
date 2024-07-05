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

cytoscape.use(dagre);
cytoscape.use(cola);
cytoscape.use(undoRedo);
cytoscape.use(expandCollapse);
cytoscape.use(nodeHtmlLabel);

const graphStyles = [
    {
        selector: "node",
        style: {
            label: "data(label)",
            color: "rgba(8,67,117,1)", //font color
            backgroundColor: "#87a2e5", //bg color of node
            width: "40px", //width
            height: "40px", //height
            "text-valign": "bottom", //moved text to bottom
            "text-halign": "center", //centered text
            "font-size": "15px", //font size
            "text-margin-y": 6, //margin
            "text-background-color": "#fff", //text bg if needed
            "text-background-opacity": 1,
            "text-background-padding": "3px",
            "text-background-shape": "roundrectangle", //bg shape of text bg
        },
    },
    {
        selector: "node:selected", //css for selected node
        style: {
            "border-width": "3px", //adding border for selected node
            "border-color": "#86b2e8", //border color
            "border-style": "solid",
            "background-color": "#5278ea",
        },
    },
    {
        selector: "edge",
        style: {
            width: 2, //edge width
            "line-color": "#4459a3", //edge color
            "text-valign": "bottom",
            "curve-style": "bezier",
            "source-endpoint": "outside-to-node",
            "target-endpoint": "outside-to-node",
            "target-arrow-shape": "triangle", // Arrow shape
            "target-arrow-color": "#4459a3", // Arrow color
        },
    },
    {
        selector: "group",
        style: {
            "background-color": "#f0f0f0",
            "border-color": "#000",
            "border-width": 2,
            "border-opacity": 0.5,
        },
    }
] as any;

const Cyto = () => {
    const data = [

        { data: { id: "g1", name: "Group1" } },
      
        { data: { id: "1", label: "Item1", parent: "g1" }, },
        { data: { id: "2", label: "Item2", }, },
        { data: { id: "3", label: "Item3", }, },

        { data: { id: "4", label: "Item4", }, },
        { data: { id: "5", label: "Item5", }, },
        { data: { id: "6", label: "Item6", }, },

        { data: { id: "edge1", source: "1", target: "4", }, },
        { data: { id: "edge2", source: "2", target: "5", }, },
        { data: { id: "edge3", source: "3", target: "6", }, },
    ];

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
        });

        cy.zoom(config.zoom);
        cy.center();
    }
    , []);

    return <div id="cy" style={{height: "100vh", width: "100%"}}/>;

};

export default Cyto;