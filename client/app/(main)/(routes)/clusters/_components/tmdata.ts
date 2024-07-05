export type TreeNode = {
    type: 'node';
    value: number;
    fever: number;
    name: string;
    children: Tree[];
};
export type TreeLeaf = {
    type: 'leaf';
    name: string;
    fever: number;
    value: number;
};

export type Tree = TreeNode | TreeLeaf;

export function findNode(root: Tree, name: string): Tree | null {
    if (root.type === 'leaf') {
        return root.name === name ? root : null;
    }
    if (root.name === name) {
        return root;
    }
    for (const child of root.children) {
        const node = findNode(child, name);
        if (node) {
            return node;
        }
    }
    return null;
}

export const data3: Tree = {
    type: "node",
    name: "package",
    fever: 0,
    value: 0,
    children: [
        {
            type: "node",
            name: "controllers",
            fever: 0,
            value: 0,
            children: [
                {type: "leaf", name: "Mark", value: 90, fever: 20},
                {type: "leaf", name: "Robert", value: 12, fever: 3},
                {type: "leaf", name: "Emily", value: 34, fever: 98},
                {type: "leaf", name: "Marion", value: 53, fever: 10},
            ],
        },
        {
            type: "node",
            name: "repositories",
            fever: 0,
            value: 0,
            children: [
                {type: "leaf", name: "Nicolas", value: 98, fever: 15},
                {type: "leaf", name: "Malki", value: 22, fever: 59},
                {type: "leaf", name: "Djé", value: 12, fever: 32},
                {type: "leaf", name: "Moussa", value: 6, fever: 2},
            ],
        },
        {
            type: "node",
            name: "services",
            fever: 0,
            value: 0,
            children: [
                {type: "leaf", name: "Mélanie", value: 45, fever: 12},
                {type: "leaf", name: "Einstein", value: 76, fever: 45},
                {type: "leaf", name: "Newton", value: 23, fever: 78},
                {type: "leaf", name: "Galileo", value: 67, fever: 23},
                {type: "leaf", name: "Aristote", value: 45, fever: 45},
                {type: "leaf", name: "Platon", value: 76, fever: 76},
                {type: "leaf", name: "Socrate", value: 23, fever: 23},
                {type: "leaf", name: "Heraclite", value: 67, fever: 67},
            ],
        },
    ],
};
