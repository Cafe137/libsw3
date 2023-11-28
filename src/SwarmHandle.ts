import { Bee } from '@ethersphere/bee-js'

import { SwarmResource } from './SwarmResource'

export class SwarmHandle {
    constructor(public name: string, public hash: string, public contentType: string) {}

    async load(): Promise<SwarmResource> {
        const bee = new Bee('http://localhost:1633')
        const data = await bee.downloadData(this.hash)
        return new SwarmResource(this.name, data, this.contentType)
    }
}
