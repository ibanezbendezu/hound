"use client"

import {cluster} from "@/repositories";
import File from "../../_components/file";
import {Cluster} from "../../_components/cluster";

const repos = cluster;

const FilePage = () => {
    return (
        <div className="min-h-full flex flex-col dark:bg-[#1F1F1F]">
            {/* <File/> */}
            <Cluster/>
        </div>
    );
};

export default FilePage;
