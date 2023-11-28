import { Bee } from '@ethersphere/bee-js'
import { Random, Strings } from 'cafe-utility'
import { Wallet } from 'ethers'
import { Bytes } from 'mantaray-js'
import { SwarmCollection } from './SwarmCollection'
import { getStamp } from './Utility'

export class SwarmWebsite {
    constructor(public identfier: string, public collection: SwarmCollection) {}

    public async generateAddress(): Promise<string> {
        const bee = new Bee('http://localhost:1633')
        const stamp = await getStamp()
        const privateKey = Strings.randomHex(64, Random.makeSeededRng(Strings.hashCode(this.identfier)))
        const address = new Wallet(privateKey).address
        const feedReference = await bee.createFeedManifest(stamp, 'sequence', '0'.repeat(64), address)
        return feedReference.reference
    }

    public async publish(): Promise<string> {
        const bee = new Bee('http://localhost:1633')
        const stamp = await getStamp()
        const privateKey = Strings.randomHex(64, Random.makeSeededRng(Strings.hashCode(this.identfier)))
        const writer = bee.makeFeedWriter('sequence', '0'.repeat(64), privateKey)
        const feedUploadResults = await writer.upload(
            stamp,
            Strings.hexToUint8Array(this.collection.getHash()) as Bytes<32>,
            { deferred: true }
        )
        return feedUploadResults
    }
}
