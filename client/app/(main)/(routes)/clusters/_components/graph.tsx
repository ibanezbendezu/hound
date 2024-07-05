import React, {useEffect, useRef} from 'react';
import * as d3 from 'd3';
import {SimulationNodeDatum} from 'd3';
import {select, zoom as d3Zoom, zoomIdentity, drag as d3Drag} from 'd3';
import {Treemap} from "../_components/treemap";
import ReactDOM from 'react-dom';
import {forceCollide} from 'd3-force';

type Node = any;
type Link = any;

type Props = {
    width: number;
    height: number;
    data: { nodes: any[], links: any[] };
};

const Graph: React.FC<Props> = ({width, height, data}) => {
    const ref = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (ref.current) {
            const svg = d3.select(ref.current);
            let g: d3.Selection<SVGGElement, unknown, null, undefined> = svg.select('g');

            if (g.empty()) {
                g = svg.append('g');
            }

            const zoom = d3Zoom<SVGSVGElement, unknown>()
                .scaleExtent([0.5, 5])
                .on('zoom', (event) => {
                    g.attr('transform', event.transform);
                });

            const simulation = d3.forceSimulation(data.nodes as SimulationNodeDatum[])
                .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(220))
                .force('collide', forceCollide().radius(80))
                .force("charge", d3.forceManyBody().strength(-250))
                .force("center", d3.forceCenter(width / 2.7, height / 2.5));

            const link = g.append("g")
                .attr("stroke", "#999")
                .attr("stroke-opacity", 0.6)
                .selectAll("line")
                .data(data.links)
                .join("line");

            const node = g.append("g")
                .selectAll("g.node")
                .data(data.nodes)
                .join("g")
                .attr("class", "node");

            node.each(function (d, i) {
                const offsetX = 25;
                const offsetY = 25;

                const x = (d: any) => d.x - offsetX;
                const y = (d: any) => d.y - offsetY;

                const treemapContainer = d3.select(this)
                    .append('foreignObject')
                    .attr('width', 100)
                    .attr('height', 60)
                    .attr('x', x)
                    .attr('y', y)
                    .node() as Element;

                console.log(d);
                const treemap = <Treemap height={60} width={100} data={d}/>;
                ReactDOM.render(treemap, treemapContainer);
            });

            simulation.on("tick", () => {
                link
                    .attr("x1", (d: any) => d.source.x)
                    .attr("y1", (d: any) => d.source.y)
                    .attr("x2", (d: any) => d.target.x)
                    .attr("y2", (d: any) => d.target.y);

                node
                    .attr("transform", (d: any) => `translate(${d.x}, ${d.y})`);
            });

            svg.call(zoom);

        }
    }, [width, height, data]);

    return <svg ref={ref} viewBox="0 0 1000 460"/>;
};

export default Graph;