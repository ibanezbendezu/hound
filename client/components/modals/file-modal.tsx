"use client";

import {Dialog, DialogContent, DialogHeader} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {useFile} from "@/hooks/use-file";
import {useRouter} from "next/navigation";

export const FileModal = () => {
    const router = useRouter();
    const file = useFile();

    const onFile = () => {
        router.push(`/files/${file.file.id}`);
    };

    return (
        <Dialog open={file.isOpen} onOpenChange={file.onClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <h2 className="text-lg font-medium">{file.file.name}</h2>
                </DialogHeader>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-1">
                        <Label>Fever</Label>
                        <span className="text-[0.8rem] text-muted-foreground">
                            {file.file.fever}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};
