"use client";

import {Dialog, DialogContent, DialogHeader} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {useEdge} from "@/hooks/use-edge"
import {GitCompareArrows} from 'lucide-react';

export const EdgeModal = () => {
    const edge = useEdge();

    return (
        <Dialog open={edge.isOpen} onOpenChange={edge.onClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                <h2 className="text-lg font-medium">
                    {edge.edge.sourceName}
                    <GitCompareArrows size={20} className="inline-block mx-2"/>
                    {edge.edge.targetName}
                </h2>
                </DialogHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>% de similitud</Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            {edge.edge.similarity}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
