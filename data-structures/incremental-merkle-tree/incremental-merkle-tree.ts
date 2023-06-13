import checkParameter from "./checkParameter"
import { HashFunction, MerkleProof, Node } from "./types"

export default class IncrementalMerkleTree {
    private readonly _nodes: Node[][]
    private readonly _hash: HashFunction

    /**
     * Initializes the tree with the hash function and the arity (i.e.
     * the number of children for each node).
     * @param hash Hash function.
     */
    constructor(hash: HashFunction) {
        checkParameter(hash, "hash", "function")

        // TODO: Re-create function to add many leaves at once.

        // Initialize the attributes.
        this._nodes = [[]]
        this._hash = hash
    }

    /**
     * Returns the root hash of the tree.
     * @returns Root hash.
     */
    public get root(): Node {
        return this._nodes.at(-1)![0]
    }

    /**
     * Returns the depth of the tree.
     * @returns Tree depth.
     */
    public get depth(): number {
        return this._nodes.length - 1
    }

    /**
     * Returns the leaves of the tree.
     * @returns List of leaves.
     */
    public get leaves(): Node[] {
        return this._nodes[0].slice()
    }

    /**
     * Returns the number of leaves in the tree.
     * @returns Number of leaves.
     */
    public get size(): number {
        return this._nodes[0].length
    }

    /**
     * Returns the index of a leaf. If the leaf does not exist it returns -1.
     * @param leaf Tree leaf.
     * @returns Index of the leaf.
     */
    public indexOf(leaf: Node): number {
        checkParameter(leaf, "leaf", "number", "string", "bigint")

        return this._nodes[0].indexOf(leaf)
    }

    /**
     * Inserts a new leaf in the tree.
     * @param leaf New leaf.
     */
    public insert(leaf: Node) {
        checkParameter(leaf, "leaf", "number", "string", "bigint")

        // It calculates the next depth.
        if (this.depth < Math.ceil(Math.log2(this.size + 1))) {
            this._nodes.push([])
        }

        let node = leaf
        let index = this.size

        for (let level = 0; level < this.depth; level += 1) {
            this._nodes[level][index] = node

            // Bitwise AND, 0 -> left or 1 -> right.
            // If the node is a right node the parent node will be the hash
            // of the child nodes. Otherwise, parent will equal left child node.
            if (index & 1) {
                const sibling = this._nodes[level][index - 1]
                node = this._hash(sibling, node)
            }

            // Right shift, it divides a number by 2 and discards the remainder.
            index >>= 1
        }

        // Finally, it stores the new root.
        this._nodes[this.depth] = [node]
    }

    generateMerkleProof(leaf: Node): MerkleProof {
        checkParameter(leaf, "leaf", "number", "string", "bigint")

        let index = this.indexOf(leaf)

        if (index === -1) {
            throw new Error("The leaf does not exist in this tree")
        }

        const path = index
        const siblings: Node[] = []

        for (let level = 0; level < this.depth; level += 1) {
            const siblingIndex = index & 1 ? index - 1 : index + 1

            siblings.push(this._nodes[level][siblingIndex])

            index >>= 1
        }

        // TODO: Undefined nodes could be removed, but the index needs to be updated.

        return { root: this.root, leaf, path, siblings }
    }
}
