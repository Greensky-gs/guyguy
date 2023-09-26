import MonitorCache from "../types/MonitorCache";
import List from "./List.js";
import VintedItem from "./VintedItem.js";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export default class VintedMonitor {
    private cache: MonitorCache[] = [];
    private vintedEvent: ((item: VintedItem) => unknown) | undefined;
    private timeRange: number;

    constructor(timeRange: number = 60 * 60 * 1000){
        if (timeRange < 60000) throw "Invalid Time Range";
        this.timeRange = timeRange;
    }

    // Example : https://www.vinted.be/vetements?search_text=casquette&brand_id[]=362&order=newest_first&color_id[]=12
    watch(url: string | string[]){
        const push = (u: string) => this.cache.push({ subUrl: u, items: [], list: [] });
        if (Array.isArray(url)) {
            for (const u of url) {
                push(u)
            }
        } else {
            push(url)
        }
        this.check(this.cache.length - 1, true);
        return this;
    }

    unWatch(url: string){
        let removed = false;
        if(this.cache.find(e => e.subUrl == url)) this.cache.splice(this.cache.findIndex(e => e.subUrl == url),1), removed = true;
        return removed;
    }

    onItemFound(callback: (item: VintedItem) => unknown){
        this.vintedEvent = callback;
    }

    private async check(id: number, request: boolean){
        const url = this.cache[id]?.subUrl;
        if (!url) return
        if (request) this.cache[id].list = await new List(url).initialize(this.timeRange);
        if (Object.values(this.cache[id].list).length == 0){
            await sleep(2000);
            this.check(id, true);
            return;
        }
        const newItem = new VintedItem(
            Object.values(this.cache[id].list).find(
                (item: any) => !this.cache[id].items.find(
                    (e: any) => e.id == item.id
                )
            )
        );
        const finishedItem = await newItem.initialize(url);
        if(!this.cache[id]) return
        if(finishedItem){
            if(finishedItem == "rateLimit"){
                await sleep(5000)
                this.check(id, false)
            } else {
                this.cache[id].items.push(finishedItem);
                if(this.vintedEvent) this.vintedEvent(newItem);
                await sleep(1000);
                this.check(id, false)
            }
        } else {
            await sleep(2000)
            this.check(id, true)
        }
    }
}