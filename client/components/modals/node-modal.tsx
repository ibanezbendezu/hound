"use client";

import {Dialog, DialogContent, DialogHeader} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {useNode} from "@/hooks/use-node"
import {GitCompareArrows} from 'lucide-react';

export const NodeModal = () => {
    const node = useNode();

    return (
        <Dialog open={node.isOpen} onOpenChange={node.onClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                <h2 className="text-lg font-medium">
                    {node.node.sourceName}
                    <GitCompareArrows size={20} className="inline-block mx-2"/>
                    {node.node.targetName}
                </h2>
                </DialogHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>% de similitud</Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            {node.node.similarity}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
