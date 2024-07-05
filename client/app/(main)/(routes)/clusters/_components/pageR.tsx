"use client"

import Graph from "../_components/graph";
import {Spinner} from "@/components/spinner";
import {Tree} from "../_components/tree"
import {useEffect, useState} from "react";
import {clusterDataRequest} from "@/api/server-data";

export default function GraphPage({params}: { params: any }) {

    const [clusters, setClusters] = useState<{ nodes: any[]; links: any[]; } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const res = await clusterDataRequest(params.id);
            const data = convertRepositoriesToGraphData(res.data.repositories);
            console.log(data);
            setClusters(data);
            setLoading(false);
        };

        fetchData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg"/>
            </div>
        );
    }

    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            {clusters && <Graph width={1300} height={510} data={clusters}/>}
        </div>
    );
};


function convertRepositoriesToGraphData(repositories: any[]): { nodes: any[], links: any[] } {
    const nodes: {
        id: number,
        type?: string,
        name?: string,
        fever?: number,
        totalLines?: number,
        owner?: string,
        repo?: string,
        sha?: string,
        value?: number,
        edges?: any[],
        children?: Tree[],

    }[] = [];
    const links: { source: number, target: number }[] = [];

    repositories.forEach((repo, index) => {
        const repoNode = {
            type: repo.type,
            name: repo.name,
            fever: repo.fever,
            value: repo.value,
            id: repo.id,
            sha: repo.sha,
            repo: repo.repo,
            owner: repo.owner,
            totalLines: repo.totalLines,
            edges: repo.edges,
            children: repo.children,
        };
        nodes.push(repoNode);

        repo.edges.forEach((edge: any) => {
            const source = repo.id;
            const target = edge.id;
            const link = {source, target};
            if (!links.some(l => (l.source === source && l.target === target) || (l.source === target && l.target === source))) {
                links.push(link);
            }
        });
    });

    return {nodes, links};
}
