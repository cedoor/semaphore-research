import checkParameter from "./checkParameter"
import _indexOf from "./indexOf"
import { HashFunction, Node } from "./types"

/**
 * A Merkle tree is a tree in which every leaf node is labelled with the cryptographic hash of a
 * data block, and every non-leaf node is labelled with the cryptographic hash of the labels of its child nodes.
 * It allows efficient and secure verification of the contents of large data structures.
 * The IncrementalMerkleTree class is a TypeScript implementation of Incremental Merkle tree and it
 * provides all the functions to create efficient trees and to generate and verify proofs of membership.
 */
export default class IncrementalMerkleTree {
    static readonly maxDepth = 32

    private readonly _nodes: Node[][]
    private readonly _hash: HashFunction
    private readonly _depth: number
    private readonly _arity: number

    /**
     * Initializes the tree with the hash function, the depth, the zero value to use for zeroes
     * and the arity (i.e. the number of children for each node).
     * @param hash Hash function.
     * @param depth Tree depth.
     * @param arity The number of children for each node.
     */
    constructor(hash: HashFunction, depth: number, arity = 2) {
        checkParameter(hash, "hash", "function")
        checkParameter(depth, "depth", "number")
        checkParameter(arity, "arity", "number")

        if (depth < 1 || depth > IncrementalMerkleTree.maxDepth) {
            throw new Error("The tree depth must be between 1 and 32")
        }

        // Initialize the attributes.
        this._hash = hash
        this._depth = depth
        this._nodes = []
        this._arity = arity

        for (let level = 0; level <= depth; level += 1) {
            this._nodes[level] = []
        }

        // Freeze the array objects. It prevents unintentional changes.
        Object.freeze(this._nodes)
    }

    /**
     * Returns the root hash of the tree.
     * @returns Root hash.
     */
    public get root(): Node {
        return this._nodes[this.depth][0]
    }

    /**
     * Returns the depth of the tree.
     * @returns Tree depth.
     */
    public get depth(): number {
        return this._depth
    }

    /**
     * Returns the leaves of the tree.
     * @returns List of leaves.
     */
    public get leaves(): Node[] {
        return this._nodes[0].slice()
    }

    /**
     * Returns the number of children for each node.
     * @returns Number of children per node.
     */
    public get arity(): number {
        return this._arity
    }

    /**
     * Returns the index of a leaf. If the leaf does not exist it returns -1.
     * @param leaf Tree leaf.
     * @returns Index of the leaf.
     */
    public indexOf(leaf: Node): number {
        return _indexOf(leaf, this._nodes)
    }

    /**
     * Inserts a new leaf in the tree.
     * @param leaf New leaf.
     */
    public insert(leaf: Node) {
        checkParameter(leaf, "leaf", "number", "string", "bigint")

        if (this.leaves.length >= this.arity ** this.depth) {
            throw new Error("The tree is full")
        }

        let node = leaf
        let index = this.leaves.length

        for (let level = 0; level < this.depth; level += 1) {
            const position = index % this.arity

            this._nodes[level][index] = node
            index = Math.floor(index / this.arity)

            if (position !== 0) {
                node = this._hash(this._nodes[level + 1][index], node)
            }
        }

        return node
    }
}
