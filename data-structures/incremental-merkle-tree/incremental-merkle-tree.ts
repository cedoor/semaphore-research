import checkParameter from "./checkParameter"
import { HashFunction, Node } from "./types"

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

        this._insert(0, this.size, leaf)
    }

    _insert(level: number, index: number, node: Node) {
        if (this.depth === level) {
            this._nodes[level] = [node]
            return
        }

        this._nodes[level][index] = node

        if (index % 2 === 0) {
            this._insert(level + 1, Math.floor(index / 2), node)
        } else {
            const sibling = this._nodes[level][index - 1]
            const hash = this._hash(sibling, node)

            this._insert(level + 1, Math.floor(index / 2), hash)
        }
    }
}
