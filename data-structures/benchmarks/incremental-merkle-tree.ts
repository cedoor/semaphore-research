import b from "benny"
import { poseidon2 } from "poseidon-lite/poseidon2"
import { IncrementalMerkleTree as OIncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree"
import { IncrementalMerkleTree } from "../incremental-merkle-tree"

const name = "incremental-merkle-tree"

export default async function run() {
    const tree1 = new IncrementalMerkleTree((a, b) => poseidon2([a, b]), 20, 2)
    const tree2 = new OIncrementalMerkleTree(poseidon2, 20, BigInt(0), 2)

    const numberOfLeaves = 2 ** 6

    b.suite(
        name,

        b.add(`New IncrementalMerkleTree - insert (${numberOfLeaves} leaves)`, () => {
            for (let i = 0; i < numberOfLeaves; i += 1) {
                tree1.insert(BigInt(i + 1))
            }
        }),

        b.add(`Old IncrementalMerkleTree - insert (${numberOfLeaves} leaves)`, () => {
            for (let i = 0; i < numberOfLeaves; i += 1) {
                tree2.insert(BigInt(i + 1))
            }
        }),

        b.cycle(),
        b.complete(),

        b.save({ folder: "benchmarks/results", file: name, version: "1.0.0", details: true }),
        b.save({ folder: "benchmarks/results", file: name, format: "chart.html", details: true }),
        b.save({ folder: "benchmarks/results", file: name, format: "table.html", details: true })
    )
}
