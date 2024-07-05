"use client";

import {Dialog, DialogContent, DialogHeader} from "@/components/ui/loading-dialog";
import {Label} from "@/components/ui/label";
import {ModeToggle} from "@/components/mode-toggle";
import {useLoading} from "@/hooks/use-loading";
import {Spinner} from "../spinner";

export const LoadingModal = () => {
    const loading = useLoading();

    return (
        <Dialog open={loading.isOpen}>
            <DialogContent>
                <DialogHeader className="b pb-3">
                    <div className="flex items-center justify-center">
                        <h2 className="text-lg font-medium">Comparando repositorios...</h2>
                        <img src="/logo-dark.svg" alt="Hound" className="w-8 h-8 hidden dark:block ml-2"/>
                        <img src="/logo.svg" alt="Hound" className="w-8 h-8 dark:hidden ml-2"/>
                    </div>
                </DialogHeader>
                <div className="flex items-center justify-center">
                    <div className="flex flex-col gap-y-1">
                        <Spinner size="lg"/>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
