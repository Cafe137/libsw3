import { Bee } from '@ethersphere/bee-js'
import { getStamp } from './Utility'

export class SwarmRawData {
    hash?: string

    constructor(public data: Uint8Array | string, public contentType: string) {}

    async save(): Promise<string> {
        if (this.hash) {
            return this.hash
        }
        const bee = new Bee('http://localhost:1633')
        const stamp = await getStamp()
        const { reference } = await bee.uploadData(stamp, this.data, {
            deferred: true
        })
        this.hash = reference
        return this.hash
    }

    static async fromHash(hash: string, contentType: string): Promise<SwarmRawData> {
        const bee = new Bee('http://localhost:1633')
        const data = await bee.downloadData(hash)
        return new SwarmRawData(data, contentType)
    }

    get utf8(): string {
        if (typeof this.data === 'string') {
            return this.data
        }
        return new TextDecoder().decode(this.data)
    }

    get bytes(): Uint8Array {
        if (typeof this.data === 'string') {
            return new TextEncoder().encode(this.data)
        }
        return this.data
    }
}
