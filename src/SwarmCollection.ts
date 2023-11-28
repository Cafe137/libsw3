import { Bee } from '@ethersphere/bee-js'
import { Strings } from 'cafe-utility'
import { MantarayNode, Reference } from 'mantaray-js'
import { SwarmHandle } from './SwarmHandle'

import { SwarmRawData } from './SwarmRawData'
import { SwarmResource } from './SwarmResource'
import { getStamp } from './Utility'

export class SwarmCollection {
    public handles: Map<string, SwarmHandle> = new Map()

    private dirty = false
    private hash?: string

    constructor() {}

    public async addRawData(path: string, data: SwarmRawData) {
        await data.save()
        this.handles.set(path, new SwarmHandle(path, data.hash!, data.contentType))
        this.dirty = true
    }

    public async addResource(path: string, data: SwarmResource) {
        await data.save()
        this.handles.set(path, data.handle!)
        this.dirty = true
    }

    public async addHandle(path: string, handle: SwarmHandle) {
        this.handles.set(path, handle)
        this.dirty = true
    }

    public getHash() {
        if (!this.hash || this.dirty) {
            throw new Error('Collection is not saved')
        }
        return this.hash
    }

    public async save(): Promise<string> {
        const bee = new Bee('http://localhost:1633')
        const stamp = await getStamp()
        const mantaray = new MantarayNode()
        for (const [rawPath, handle] of this.handles.entries()) {
            const path = new TextEncoder().encode(rawPath)
            const filename = Strings.normalizeFilename(rawPath)
            mantaray.addFork(path, Strings.hexToUint8Array(handle.hash) as Reference, {
                'Content-Type': handle.contentType,
                Filename: filename,
                'website-index-document': 'index.html',
                'website-error-document': 'index.html'
            })
        }
        const reference = await mantaray.save(async (data: Uint8Array) => {
            const { reference } = await bee.uploadData(stamp, data, { deferred: true })
            return Strings.hexToUint8Array(reference) as Reference
        })
        this.dirty = false
        this.hash = Strings.uint8ArrayToHex(reference)
        return this.hash
    }
}
