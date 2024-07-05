"use client";

import {SettingsModal} from "@/components/modals/settings-modal";
import {FileModal} from "../modals/file-modal";
import {EdgeModal} from "../modals/edge-modal";
import {LoadingModal} from "../modals/loading-modal";
import {useEffect, useState} from "react";
import { NodeModal } from "../modals/node-modal";


export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <SettingsModal/>
            <FileModal/>
            <EdgeModal/>
            <NodeModal/>
            <LoadingModal/>
        </>
    );
};
