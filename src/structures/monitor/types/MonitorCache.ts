import List from "../class/List.js"
import VintedItemType from "./VintedItemType";

export default interface MonitorCache {
    subUrl: string;
    items: VintedItemType[];
    list: List | [];
}