import VintedItemPhoto from "./VintedItemPhoto.js";
import VintedItemLocation from "./VintedItemLocation.js";
import VintedUserType from "./VintedUserType.js";

export default interface VintedItemType {
    id: number;
    title: string;
    price: { amount: string; currency_code: string };
    currency: string;
    brand_title: string;
    is_for_swap: boolean;
    searchUrl: string;
    url: string;
    photo: VintedItemPhoto;
    favourite_count: number;
    service_fee: string | null;
    total_item_price: { amount: string; currency_code: string; };
    view_count: number;
    size_title: string | null;
    description: string | null;
    location: VintedItemLocation;
    user: VintedUserType | undefined;
    date: Date | null;
}