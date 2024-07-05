import {create} from "zustand";

type NodeStore = {
    isOpen: boolean;
    node: any;
    onOpen: () => void;
    onClose: () => void;
    addNode: (node: string) => void;
    removeNode: (node: string) => void;
};

export const useNode = create<NodeStore>((set) => ({
    isOpen: false,
    node: {},
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
    addNode: (node) => set({node}),
    removeNode: () => set({node: {}}),
}));
