"use client"

import {cluster} from "@/repositories";
import Cyto from "./_components/cyto";
import Test from "./_components/test";

const repos = cluster;

const GraphPage = () => {
    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            {/* <Cyto/> */}
            <Test/>

        </div>
    );
};

export default GraphPage;
