import database from "../../../cache/database";
import MonitorCache from "../types/MonitorCache";
import List from "./List.js";
import VintedItem from "./VintedItem.js";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export default class VintedMonitor {
    private _cache: MonitorCache[] = [];
    private found: string[] = []
    private vintedEvent: ((item: VintedItem, data: { name: string; url: string; channelId: string }) => unknown) | undefined;
    private timeRange: number;

    constructor(timeRange: number = 30 * 60 * 1000){
        this.timeRange = timeRange;
        this.found = database.getValue('cache')
    }

    public get cache() {
        return this._cache
    }

    // Example : https://www.vinted.be/vetements?search_text=casquette&brand_id[]=362&order=newest_first&color_id[]=12
    watch(url: string | string[]){
        const push = (u: string) => this._cache.push({ subUrl: u, items: [], list: [] });
        if (Array.isArray(url)) {
            for (const u of url) {
                push(u)
            }
        } else {
            push(url)
        }
        this.check(this._cache.length - 1, true);
        return this;
    }

    unWatch(url: string){
        let removed = false;
        if(this._cache.find(e => e.subUrl == url)) this._cache.splice(this._cache.findIndex(e => e.subUrl == url),1), removed = true;
        return removed;
    }

    onItemFound(callback: (item: VintedItem, search: { name: string; channelId: string; url: string; }) => unknown) {
        this.vintedEvent = callback;
    }

    private async check(id: number, request: boolean){
        const url = this._cache[id]?.subUrl;
        if (!url) return
        if (request) this._cache[id].list = await new List(url).initialize(this.timeRange);

        if (Object.values(this._cache[id].list).length == 0){
            await sleep(2000);
            this.check(id, true);
            return;
        }
        const newItem = new VintedItem(
            Object.values(this._cache[id].list).find(
                (item: any) => !this._cache[id].items.find(
                    (e: any) => e.id == item.id
                )
            )
        );
        const finishedItem = await newItem.initialize(url);
        if(!this._cache[id]) return
        if(finishedItem) {
            if (finishedItem == "rateLimit"){
                await sleep(5000)
                this.check(id, false)
            } else {
                if (this.found.includes(newItem.info.id.toString())) return
                this.found.push(newItem.info.id.toString())
                database.pushTo('cache', newItem.info.id.toString())

                this._cache[id].items.push(finishedItem);
                if (this.vintedEvent) this.vintedEvent(newItem, database.getValue('searchs').find(x => x.url === url));
                await sleep(1000);
                this.check(id, false)
            }
        } else {
            await sleep(2000)
            this.check(id, true)
        }
    }
}