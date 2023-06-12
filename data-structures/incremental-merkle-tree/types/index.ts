export type Node = number | string | bigint

export type HashFunction = (a: Node, b: Node) => Node

export type MerkleProof = {
    root: any
    leaf: any
    leafIndex: number
    siblings: any[]
    pathIndices: number[]
}
