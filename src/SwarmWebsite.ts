import { Bee } from '@ethersphere/bee-js'
import { Binary, Random, Strings } from 'cafe-utility'
import { Wallet } from 'ethers'
import { Bytes } from 'mantaray-js'
import { SwarmCollection } from './SwarmCollection'
import { SwarmSettings } from './SwarmSettings'

export class SwarmWebsite {
    constructor(private settings: SwarmSettings, public privateKey: string, public collection: SwarmCollection) {}

    public async generateAddress(): Promise<string> {
        const bee = new Bee(this.settings.beeApi)
        const address = new Wallet(this.privateKey).address
        const feedReference = await bee.createFeedManifest(
            this.settings.postageBatchId,
            'sequence',
            '0'.repeat(64),
            address
        )
        return feedReference.reference
    }

    public async publish(index?: number): Promise<string> {
        const bee = new Bee(this.settings.beeApi)
        const privateKey = Strings.randomHex(64, Random.makeSeededRng(Strings.hashCode(this.privateKey)))
        const writer = bee.makeFeedWriter('sequence', '0'.repeat(64), privateKey)
        const feedUploadResults = await writer.upload(
            this.settings.postageBatchId,
            Binary.hexToUint8Array(this.collection.getHash()) as Bytes<32>,
            { deferred: true, index }
        )
        return feedUploadResults
    }
}
