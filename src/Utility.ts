import { BeeDebug } from '@ethersphere/bee-js'

export async function getStamp(): Promise<string> {
    const beeDebug = new BeeDebug('http://localhost:1635')
    const stamps = await beeDebug.getAllPostageBatch()
    const usableStamps = stamps.filter(stamp => stamp.usable)
    if (usableStamps.length === 0) {
        throw new Error('No usable stamps')
    }
    return usableStamps[0].batchID
}

export function determineContentType(name: string): string {
    const ext = name.split('.').pop()?.toLowerCase()
    switch (ext) {
        case 'html':
            return 'text/html'
        case 'css':
            return 'text/css'
        case 'js':
            return 'text/javascript'
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg'
        case 'png':
            return 'image/png'
        case 'gif':
            return 'image/gif'
        case 'svg':
            return 'image/svg+xml'
        case 'json':
            return 'application/json'
        case 'md':
        case 'markdown':
            return 'text/markdown'
        default:
            return 'application/octet-stream'
    }
}
