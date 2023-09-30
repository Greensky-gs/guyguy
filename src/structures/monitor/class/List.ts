import Query from "./Query";
import VintedItem from "./VintedItem";


export default class List {
    public url: string;
    public items: [] = [];

    constructor(url: string){
        this.url = url;
        return this;
    }
    
    async initialize(timeRange: number) {
        const items = await new Query(this.url).send(timeRange);
        this.items = (items || []);
        return this.items;
    }
}