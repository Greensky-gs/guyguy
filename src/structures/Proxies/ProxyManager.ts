import proxies from '../../data/proxies.json'
import { ProxiesCache } from '../../typings/structures'

export class ProxyManager {
    private cache: ProxiesCache[] = []
    private index: number = 0;
    private maxUses: number;

    constructor(maxUses: number) {
        this.maxUses = maxUses
        this.start()
    }

    public get proxy() {
        if (this.cache.length === 0) return undefined;
        this.index++

        return this.cache[this.index % this.cache.length].proxy
    }
    private get current() {
        return this.cache[this.index]
    }

    private start() {
        this.cache = proxies.map(p => ({ proxy: p, uses: 0 }))
    }
}