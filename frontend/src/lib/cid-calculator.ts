import { importer } from 'ipfs-unixfs-importer';
import { MemoryBlockstore } from 'blockstore-core/memory';

export async function cidCalculator(file: File) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const blockstore = new MemoryBlockstore();

    const entries = importer(
        [{ path: file.name, content: bytes }],
        blockstore,
        // Following kubo defaults to get the same CID as the default IPFS implementation
        {
            cidVersion: 0,
            rawLeaves: false,
        }
    );

    let last;
    for await (const entry of entries) last = entry;
    return last!.cid.toString();
}