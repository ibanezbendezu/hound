"use client";

import {useMemo, useRef, useEffect, useState, use} from "react";
import {Tree, findNode} from "./tree";
import * as d3 from "d3";
import {scaleLinear} from 'd3-scale';
import {useFile} from "@/hooks/use-file";

type TreemapProps = {
    width: number;
    height: number;
    data: Tree;
};

export const Treemap = ({width, height, data}: TreemapProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);

    const file = useFile();

    const offset = 5;
    const colorScale = scaleLinear<string>().domain([0, 100]).range(["#2E9335", "#B82318"]);

    const [selectedNode, setSelectedNode] = useState<Tree | null>(null);
    const [nodeHistory, setNodeHistory] = useState<Array<Tree | null>>([]);

    const handleFile = (f: any) => {
        file.addFile(f);
        file.onOpen();
    }

    const handleNodeClick = (node: d3.HierarchyRectangularNode<Tree>) => {
        if (!node.children || node.children.length === 0) {
            handleFile(node.data);
            return;
        }
        const selectedNode = findNode(data, node.data.name);
        setNodeHistory([...nodeHistory, selectedNode]);
        setSelectedNode(selectedNode);
    };

    const handleGoBack = () => {
        const newHistory = [...nodeHistory];
        const lastNode = newHistory.pop() || null;
        setSelectedNode(lastNode);
        setNodeHistory(newHistory);
    };

    function root(data: Tree) {
        const hierarchy = useMemo(() => {
            const root = d3.hierarchy(data)
                .sum((d) => d.value)
                .eachAfter(node => {
                    if (node.children) {
                        const totalFever = node.children.reduce((acc, child) => acc + child.data.fever, 0);
                        const averageFever = node.children.length > 0 ? totalFever / node.children.length : 0;
                        node.data.fever = averageFever;
                    }
                });
            return root;
        }, [data]);

        const r = useMemo(() => {
            const treeGenerator = d3.treemap<Tree>().size([width, height - offset]).padding(1);
            return treeGenerator(hierarchy);
        }, [hierarchy, width, height]);

        return r;
    }

    function nodeShapes(node: Tree) {
        const tree = root(node);

        let nodesToRender;
        const level = tree.depth;
        if (level === 0 && tree.children) {
            nodesToRender = tree.children;
        } else if (level > 0) {
            nodesToRender = tree.leaves();
        } else {
            return null;
        }

        return nodesToRender.map((child, index) => (
            <g key={index} onClick={() => handleNodeClick(child)}>
                <title>{`Nombre: ${child.data.name}\nCantidad de Lineas: ${child.value}\nFever: ${child.data.fever}`}</title>
                <rect
                    x={child.x0}
                    y={child.y0 + offset}
                    width={child.x1 - child.x0}
                    height={child.y1 - child.y0}
                    stroke="transparent"
                    fill={colorScale(child.data.fever)}
                    className={"opacity-80 hover:opacity-100"}
                />
                <text
                    x={child.x0 + 2}
                    y={child.y0 + 2 + offset}
                    fontSize={2}
                    textAnchor="start"
                    alignmentBaseline="hanging"
                    fill="white"
                    className="font-bold"
                >
                    {child.data.name}
                </text>
                <text
                    x={child.x0 + 2}
                    y={child.y0 + 5 + offset}
                    fontSize={2}
                    textAnchor="start"
                    alignmentBaseline="hanging"
                    fill="white"
                    className="font-light"
                >
                    {child.value}
                </text>
            </g>
        ));
    }

    const x0 = 0;
    const y0 = 0;
    const x1 = width;
    const y1 = height;
    const borderRadius = 2;

    const d = `
        M ${x0 + borderRadius}, ${y0}
        H ${x1 - borderRadius}
        A ${borderRadius} ${borderRadius} 0 0 1 ${x1} ${y0 + borderRadius}
        V ${y1 - borderRadius}
        A ${borderRadius} ${borderRadius} 0 0 1 ${x1 - borderRadius} ${y1}
        H ${x0 + borderRadius}
        A ${borderRadius} ${borderRadius} 0 0 1 ${x0} ${y1 - borderRadius}
        V ${y0 + borderRadius}
        A ${borderRadius} ${borderRadius} 0 0 1 ${x0 + borderRadius} ${y0}
        Z
    `;

    return (
        <svg ref={svgRef} width={width} height={height}>
            <g ref={gRef}>
                <g>
                    <path d={d} fill="#363636" stroke="#363636"/>
                    <text
                        x={width / 2}
                        y={offset - 1}
                        textAnchor="middle"
                        fontSize="2.5"
                        fill="white"
                        className="font-bold"
                    >
                        {selectedNode ? selectedNode.name : data.name}
                    </text>
                    <text
                        x={3}
                        y={offset - 3}
                        textAnchor="start"
                        alignmentBaseline="hanging"
                        fontSize="2"
                        className="font-bold"
                        fill="white"
                        onClick={handleGoBack}
                        style={{cursor: 'pointer'}}
                    >
                        {selectedNode ? 'volver' : ''}
                    </text>
                </g>
                {selectedNode ? nodeShapes(selectedNode) : nodeShapes(data)}
            </g>
        </svg>
    );
}
