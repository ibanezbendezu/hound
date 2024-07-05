import {create} from "zustand";

type FileStore = {
    isOpen: boolean;
    file: any;
    onOpen: () => void;
    onClose: () => void;
    addFile: (file: string) => void;
    removeFile: (file: string) => void;
};

export const useFile = create<FileStore>((set) => ({
    isOpen: false,
    file: {},
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
    addFile: (file) => set({file}),
    removeFile: () => set({file: {}}),
}));
