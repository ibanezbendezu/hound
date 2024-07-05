import React from "react";
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
cytoscape.use(contextMenus);

export default class Test extends React.Component {
    cy: cytoscape.Core | undefined;

    constructor(props: {} | Readonly<{}>) {
        super(props);
    }

    state = {
        elements: [
			{data: {id: "1", label: "Group 1"}, classes: "group"},
			{data: {id: "a", label: "Node A", parent: "1"}},
			{data: {id: "b", label: "Node B", parent: "1"}},
			{data: {id: "c", label: "Node C", parent: "1"}},

			{data: {id: "2", label: "Group 2"}, classes: "group"},
			{data: {id: "d", label: "Node D", parent: "2"}},
			{data: {id: "e", label: "Node E", parent: "2"}},
			{data: {id: "f", label: "Node F", parent: "2"}},
			
			{data: {id: "ad", source: "a", target: "d"}},
			{data: {id: "eb", source: "e", target: "b"}},
			{data: {id: "cf", source: "c", target: "f"}},
		],
        layout: {
            name: "dagre",
        },
        zoom: 2
    };

    render() {
        return (
            <div>
                <CytoscapeComponent
                    elements={this.state.elements}
                    style={{height: "100vh", width: "100%"}}
                    cy={(cy) => {
                        this.cy = cy;
                        cy.zoom(this.state.zoom);
                        cy.center();
                    }}
                    layout={this.state.layout}
                />
            </div>
        );
    }
}
