"use client"

import {useEffect, useState} from "react";
import {useRouter, usePathname, useSearchParams} from "next/navigation";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {Spinner} from "@/components/spinner";
import {clusterDataRequest} from "@/api/server-data";
import {Box, CalendarClock, ChevronDown, File, Folder, ChevronsUpDown, Eye, FileCode, Workflow} from "lucide-react";
import {scaleLinear} from "d3-scale";
import * as d3 from "d3";
import {formatDateTime} from "@/lib/utils";

const opciones: Intl.DateTimeFormatOptions = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
};

interface Cluster {
    id: string;
    date: any;
    repositories: any[];
}

export default function ClusterPage({params}: { params: any }) {
    const colorScale = scaleLinear<string>().domain([0, 100]).range(["#2E9335", "#B82318"]);

    const [cluster, setCluster] = useState<Cluster | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname()
    const searchParams = useSearchParams()

    useEffect(() => {
        const fetchData = async () => {
            const res = await clusterDataRequest(params.id);
            console.log(res.data);
            const data = res.data;
            setCluster(data);
            setLoading(false);
        };

        fetchData();
    }, [params.id]);

    const onSelect = (id: string) => {
        router.push(pathname + `/file/${id}`);
    };

    const onGraph = (id: any) => {
        router.push(pathname + `/graph`);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg"/>
            </div>
        );
    }

    return (
        <div className="m-10">
            <div className="my-6 flex items-baseline justify-between mr-2 font-mono">
                <h2 className="text-4xl font-bold">
                    <kbd> {"Resultados de la comparación"} </kbd>
                </h2>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-2 rounded border bg-primary/10 px-1.5 font-mono text-sm font-medium text-muted-foreground opacity-100">
                    <CalendarClock className="h-4 w-4 shrink-0"></CalendarClock>
                    {formatDateTime(cluster?.date)}       
                </kbd>
            </div>

            <div className="my-4 flex items-center gap-2">
                <p className="text-sm font-normal text-muted-foreground">
                    Puedes buscar repositorios clickeando allí.
                </p>
            </div>

            <div className="my-4 flex items-center justify-center gap-2 w-full h-full">
                <div className='border-2 px-4 py-4 rounded-lg text-sm w-full h-full'>
                    <div className="flex justify-between items-center">
                        <div className="mb-2">
                            <a className='text-sm font-semibold'>
                                Datalles del grupo
                            </a>
                        </div>
                    </div>

                    <div className='text-muted-foreground flex text-sm space-x-2 items-center'>
                        <div className='font-normal text-sm'>
                            Cantidad de repositorios comparados
                        </div>
                        <span
                            className='bg-muted-foreground text-secondary text-xs font-normal px-2.5 py-0.5 rounded-lg flex items-center gap-1'>
                            {cluster?.id}
                        </span>
                    </div>
                </div>

                <div className='border-2 px-4 py-4 rounded-lg text-sm w-full h-full hover:bg-primary/5 cursor-pointer'
                    onClick={() => onGraph(cluster?.id)}>
                    <div className="flex justify-between items-center gap-10">
                        <div>
                            <a className='text-sm font-semibold'>
                                Vista de grafo
                            </a>
                            <p className='text-muted-foreground mt-2 text-sm font-light'>
                                Explora las comparaciones entre proyectos de manera visual.
                            </p>
                        </div>
                        <Workflow className="mx-5 h-16 w-16 shrink-0 opacity-50"></Workflow>
                    </div>
                </div>
            </div>
            <div className="my-6">
                <div className="my-4 flex items-center gap-2">
                    <span
                        className='bg-muted-foreground text-secondary text-sm font-semibold px-2.5 py-0.5 rounded-lg flex items-center gap-1'>
                        Resumen comparaciones:
                    </span>
                </div>
                
                <div className="my-4 flex items-center gap-2 w-full">
                    <Accordion type="multiple" className="w-full border-x-2 border-y-2 rounded">
                        {cluster?.repositories.map((repository, index) => (
                            <AccordionItem key={index} value={index.toString()}>
                                <AccordionTrigger className="p-2 border-b-2 bg-muted text-primary hover:bg-primary/5">
                                    <div className="flex items-center gap-2">
                                        <Box className="h-5 w-5 shrink-0 opacity-50"></Box>
                                        <p className="text-sm font-semibold">{repository.name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-primary/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                            <span className="text-xs">
                                                {"Nro. de folders: "}
                                                {repository.children.length}
                                            </span>       
                                        </kbd>
                                        <ChevronsUpDown className="h-5 w-5 shrink-0 opacity-50 text-current"></ChevronsUpDown>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Accordion type="multiple">
                                        {repository.children.map((folder: any, index: any) => (
                                            <AccordionItem key={index} value={index.toString()}>
                                                <AccordionTrigger className="p-2 hover:bg-primary/5">
                                                    <div className="flex items-center gap-2 ml-2">
                                                        <Folder className="h-5 w-5 shrink-0 opacity-50"></Folder>
                                                        <p className="text-sm font-semibold text-muted-foreground">{folder.name}</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-primary/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                                            <span className="text-xs">
                                                                {"Nro. de archivos: "}
                                                                {folder.children.length}
                                                            </span>
                                                        </kbd>
                                                        <kbd
                                                            style={{ backgroundColor: aColor(colorScale(aSimi(folder))) }}
                                                            className={`ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium text-current opacity-100`}>
                                                            <span className="text-xs">
                                                                {"score grupo: "}
                                                                {aSimi(folder)}
                                                                {"%"}
                                                            </span>
                                                        </kbd>
                                                        <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50 text-muted-foreground"></ChevronsUpDown>
                                                    </div>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    {folder.children.map((file: any, index: any) => (
                                                        <div key={index} className="p-2 flex items-center justify-between hover:bg-primary/5">
                                                            <div className="flex items-center gap-2 ml-2">
                                                                <FileCode className="ml-4 h-5 w-5 shrink-0 opacity-50"></FileCode>
                                                                <p className="text-xs font-semibold text-current">{file.name}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2">

                                                                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-primary/5 px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                                                    <span className="text-xs">
                                                                        {"Nro. de lineas: "}
                                                                        {file.lines}
                                                                    </span>
                                                                </kbd>
                                                                <kbd
                                                                    style={{ backgroundColor: aColor(colorScale(file.fever)) }}
                                                                    className={`ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium text-current opacity-100`}>
                                                                    <span className="text-xs">
                                                                        {"score grupo: "}
                                                                        {file.fever.toFixed(4)}
                                                                        {"%"}
                                                                    </span>
                                                                </kbd>
                                                                <kbd
                                                                    onClick={() => onSelect(file.id)}
                                                                    className="ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-primary/5 px-1.5 font-mono text-[10px] font-medium text-current opacity-100 hover:bg-primary/10 cursor-pointer">
                                                                    <span className="text-xs">
                                                                        {"ver "}
                                                                    </span>
                                                                    <Eye className="h-4 w-4 shrink-0"></Eye>
                                                                </kbd>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>
        </div>
    );
};

function aSimi(folder: any): number {
    const totalSimilarity = folder.edges.reduce((acc: any, edge: any) => acc + edge.similarity, 0);
    const averageSimilarity = totalSimilarity / folder.edges.length;
    return parseFloat((averageSimilarity * 100).toFixed(4));
}

function aColor(rgb: string): string {
    const color = d3.color(rgb);
    if (color === null) {
        return "#000000";
    }
    return color.formatHex();
}
