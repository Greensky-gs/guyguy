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
        const current = this.current
        this.cache[this.index].uses++
        if (current.uses + 1 >= this.maxUses) {
            this.index++
            if (this.index > this.cache.length - 1) {
                this.cache = this.cache.map(x => ({ ...x, uses: 0 }))
                this.index = 0
            }
        }

        return current.proxy
    }
    private get current() {
        return this.cache[this.index]
    }

    private start() {
        this.cache = proxies.map(p => ({ proxy: p, uses: 0 }))
    }
}