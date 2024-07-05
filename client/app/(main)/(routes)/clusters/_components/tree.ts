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
