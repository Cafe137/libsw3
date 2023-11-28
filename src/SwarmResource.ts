import { Bee } from '@ethersphere/bee-js'
import { SwarmHandle } from './SwarmHandle'
import { getStamp } from './Utility'

export class SwarmResource {
    handle?: SwarmHandle

    constructor(public name: string, public data: Uint8Array | string, public contentType: string) {}

    async save(): Promise<SwarmHandle> {
        if (this.handle) {
            return this.handle
        }
        const bee = new Bee('http://localhost:1633')
        const stamp = await getStamp()
        const { reference } = await bee.uploadFile(stamp, this.data, this.name, {
            contentType: this.contentType,
            deferred: true
        })
        this.handle = new SwarmHandle(this.name, reference, this.contentType)
        return this.handle
    }
}
