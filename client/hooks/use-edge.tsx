import {create} from "zustand";

type EdgeStore = {
    isOpen: boolean;
    edge: any;
    onOpen: () => void;
    onClose: () => void;
    addEdge: (edge: string) => void;
    removeEdge: (edge: string) => void;
};

export const useEdge = create<EdgeStore>((set) => ({
    isOpen: false,
    edge: {},
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
    addEdge: (edge) => set({edge}),
    removeEdge: () => set({edge: {}}),
}));
