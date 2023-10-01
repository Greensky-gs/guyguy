type User = {
    id: number;
    login: string;
    business: boolean;
    profile_url: string;
    photo: {
        id: number;
        width: number;
        height: number;
        temp_uuid: null | any;
        url: string;
        dominant_color: string;
        dominant_color_opaque: string;
        thumbnails: Array<any>;
        is_suspicious: boolean;
        orientation: null | any;
        high_resolution: {
            id: string;
            timestamp: number;
            orientation: null | any;
        };
        full_size_url: string;
        is_hidden: boolean;
        extra: any;
    };
};

type Photo = {
    id: number;
    image_no: number;
    width: number;
    height: number;
    dominant_color: string;
    dominant_color_opaque: string;
    url: string;
    is_main: boolean;
    thumbnails: Array<{
        type: string;
        url: string;
        width: number;
        height: number;
        original_size: null | any;
    }>;
    high_resolution: {
        id: string;
        timestamp: number;
        orientation: null | any;
    };
    is_suspicious: boolean;
    full_size_url: string;
    is_hidden: boolean;
    extra: any;
};

export type Item = {
    id: number;
    title: string;
    price: string;
    is_visible: number;
    discount: null | number;
    currency: string;
    brand_title: string;
    is_for_swap: boolean;
    user: User;
    url: string;
    promoted: boolean;
    photo: Photo;
    favourite_count: number;
    is_favourite: boolean;
    badge: null | any;
    conversion: null | any;
    service_fee: string;
    total_item_price: string;
    view_count: number;
    size_title: string;
    content_source: string;
    search_tracking_params: { score: null | any; matched_queries: Array<any> };
    dominant_brand?: DominantBrand;
    pagination?: {
        current_page: number;
        total_pages: number;
        total_entries: number;
        per_page: number;
        time: number;
    };
    code?: number;
};

type DominantBrand = {
    id: number;
    title: string;
    slug: string;
    favourite_count: number;
    pretty_favourite_count: string;
    item_count: number;
    pretty_item_count: string;
    is_visible_in_listings: boolean;
    requires_authenticity_check: boolean;
    is_luxury: boolean;
    path: string;
    url: string;
    is_favourite: boolean;
};

type SearchTrackingParams = {
    search_correlation_id: string;
    search_session_id: string;
    global_search_session_id: string;
};

type Pagination = {
    current_page: number;
    total_pages: number;
    total_entries: number;
    per_page: number;
    time: number;
};

export type ResponseType = {
    items: Item[];
    dominant_brand: DominantBrand;
    search_tracking_params: SearchTrackingParams;
    pagination: Pagination;
    code: number;
};
