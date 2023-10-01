import database from "../../../cache/database";
import vinted from 'vinted-api'
import List from "./List.js";
import VintedItem from "./VintedItem.js";
import { log4js } from "amethystjs";
import { Item, ResponseType } from "../../../typings/vinted";

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export default class VintedMonitor {
    private _searchs: string[] = [];
    private found: string[] = []
    private vintedEvent: ((item: VintedItem, data: { name: string; url: string; channelId: string }) => unknown) | undefined;
    private androzEvent: ((item: Item, data: { name: string; url: string; channelId: string; }) => unknown) | undefined
    private timeRange: number;
    private initied = false;

    constructor(timeRange: number = 30 * 60 * 1000){
        this.timeRange = timeRange;
        this.found = database.getValue('cache')

        this.start()
    }

    private start() {
        setInterval(() => {
            this._searchs.forEach((list, index) => {
                database.setValue('cache', this.found.slice(0, Math.ceil(this.found.length / 2)))
                this.found = []
            })
        }, 3600000)
    }
    public get cache() {
        return this._searchs
    }

    // Example : https://www.vinted.be/vetements?search_text=casquette&brand_id[]=362&order=newest_first&color_id[]=12
    watch(url: string | string[]){
        const push = (u: string) => {
            this._searchs.push(u)
        };
        if (Array.isArray(url)) {
            for (const u of url) {
                push(u)
            }
        } else {
            push(url)
        }
        return this;
    }
    public init() {
        if (this.initied) return
        this.initied = true

        setInterval(() => {
            for (let i = 0; i < this._searchs.length; i++) {
                this.check(i, true)
            }
        }, 15000)
    }

    unWatch(url: string){
        let removed = false;
        this._searchs = this._searchs.filter(x => {
            if (x === url) removed = true
            return x !== url
        })
        return removed;
    }

    public onItemFound(callback: (item: VintedItem, search: { name: string; channelId: string; url: string; }) => unknown) {
        this.vintedEvent = callback;
        return this
    }
    public onAndrozFound(callback: ((item: Item, data: { name: string; url: string; channelId: string; }) => unknown)) {
        this.androzEvent = callback
        return this;
    }

    private async usingWrapper(url: string, request: boolean, id: number) {
        let found = []
        if (request) found = await new List(url).initialize(this.timeRange);

        if (found.length == 0) return;
        const newItems = found.filter(x => !this.found.includes(x.id.toString()))

        newItems.forEach(async(item) => {
            const newItem = new VintedItem(item);
            const finishedItem = await newItem.initialize(url);
            if (!this._searchs[id]) return
            if (finishedItem) {
                if (finishedItem == "rateLimit") return
                if (this.found.includes(newItem.info.id.toString())) return
                
                this.found.push(newItem.info.id.toString())
                database.pushTo('cache', newItem.info.id.toString())
    
                if (this.vintedEvent) this.vintedEvent(newItem, database.getValue('searchs').find(x => x.url === url));
            }
        })
    }
    private async usingAndroz(url: string, id: number) {
        const posts = await vinted.search(url).catch(log4js.trace) as ResponseType;
        if (!posts || !posts.items || !posts.items?.length) return

        const found = posts.items.filter(x => !this.found.includes(x.id.toString()))
        if (!found.length) return

        found.forEach((item) => {
            if (this.found.includes(item.id.toString())) return

            this.found.push(item.id.toString())
            database.pushTo('cache', item.id.toString())

            if (this.androzEvent) this.androzEvent(item, database.getValue('searchs').find(x => x.url === url))
        })
    }
    private async check(id: number, request: boolean) {
        const url = this._searchs[id];
        if (!url) return
        
        // this.usingWrapper(url, request, id)
        this.usingAndroz(url, id)
    }
}