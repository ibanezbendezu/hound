"use client"

import React, {useState, useEffect} from 'react';
import cytoscape, { Core } from 'cytoscape';
import dagre from "cytoscape-dagre";
import fcose from "cytoscape-fcose";
import CytoscapeComponent from "react-cytoscapejs";
import cola from 'cytoscape-cola';
import undoRedo from "cytoscape-undo-redo";
import expandCollapse from 'cytoscape-expand-collapse';
import popper from 'cytoscape-popper';

import {useEdge} from '@/hooks/use-edge';
import {useNode} from '@/hooks/use-node';
import {graphStyles, expandNodeStyle} from './style';

import {c} from "../_components/c";

cytoscape.use(dagre);
cytoscape.use(cola);
cytoscape.use(fcose);
cytoscape.use(undoRedo);
cytoscape.use(expandCollapse);
cytoscape.use(popper);

type Props = {
    data: any;
};

export const Cluster: React.FC<Props> = ({data}) => {

    const edge = useEdge();
    const handleEdge = (e: any) => {
        edge.addEdge(e);
        edge.onOpen();
    }

    const node = useNode();
    const handleNode = (e: any) => {
        node.addNode(e);
        node.onOpen();
    }

    const config = {
        layout: {
            name: "fcose",
        },
        zoom: 1,
    };

    const [cy, setCy] = useState<Core | null>(null);
    
    useEffect(() => {
        if (cy) {
            const api = cy.expandCollapse({
                layoutBy: {
                    name: "preset",
                    randomize: false,
                    fit: true,
                    animate: true,
                    undoable: true,
                },
                collapseCueImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-up"><path d="m6 15 6-6 6 6"/></svg>',
                expandCueImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>',
            });            
            cy.undoRedo();
            api.collapseAll({ layoutBy: { name: "preset" } });
        }
    }, [cy]);

    return (
        <>
        <CytoscapeComponent
            cy = {(cy) => {
                setCy(cy);
                
                cy.nodes().on("expandcollapse.afterexpand", function (event: any) {
                    event.target.style(expandNodeStyle);
                });
                cy.nodes().on("expandcollapse.aftercollapse", function (event: any) {
                    event.target.removeStyle("text-valign");
                    event.target.removeStyle("background-color");
                });
                cy.on("click", "edge", (e: any) => { handleEdge(e.target.data()); } );
            }}
            layout={config.layout}
            styleEnabled={true}
            stylesheet={graphStyles}
            elements={data}
            wheelSensitivity={0.1}
            zoomingEnabled={true}
            zoom={config.zoom}
            style={{height: "100vh" as React.CSSProperties['height'], width: "100%"}}
        />
        </>
    );
};