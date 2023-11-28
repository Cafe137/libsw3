import { Bee, BeeDebug } from '@ethersphere/bee-js'
import { SwarmCollection } from './SwarmCollection'
import { SwarmHandle } from './SwarmHandle'
import { SwarmRawData } from './SwarmRawData'
import { SwarmResource } from './SwarmResource'
import { SwarmWebsite } from './SwarmWebsite'

interface SwarmConstructorParameters {
    beeApi?: string
    beeDebugApi?: string
}

export class Swarm {
    bee: Bee
    beeDebug: BeeDebug

    constructor(params?: SwarmConstructorParameters) {
        this.bee = new Bee(params?.beeApi || 'http://localhost:1633')
        this.beeDebug = new BeeDebug(params?.beeDebugApi || 'http://localhost:1635')
    }

    newHandle(name: string, hash: string, contentType: string) {
        return new SwarmHandle(name, hash, contentType)
    }

    newRawData(data: string | Uint8Array, contentType: string) {
        return new SwarmRawData(data, contentType)
    }

    newResource(name: string, data: string | Uint8Array, contentType: string) {
        return new SwarmResource(name, data, contentType)
    }

    newCollection() {
        return new SwarmCollection()
    }

    newWebsite(identifier: string, collection: SwarmCollection) {
        return new SwarmWebsite(identifier, collection)
    }

    downloadRawData(hash: string, contentType: string) {
        return SwarmRawData.fromHash(hash, contentType)
    }

    async getNodeAddress(): Promise<string> {
        return this.beeDebug.getNodeAddresses().then(addresses => addresses.ethereum)
    }

    async getUsableStamp(): Promise<string | null> {
        const postageBatches = await this.beeDebug.getAllPostageBatch()
        return postageBatches.find(batch => batch.usable)?.batchID || null
    }

    async mustGetUsableStamp(): Promise<string> {
        const stamp = await this.getUsableStamp()
        if (stamp === null) {
            throw new Error('No usable postage stamp found')
        }
        return stamp
    }
}
