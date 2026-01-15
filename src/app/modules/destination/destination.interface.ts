export type TDestination = {
    name: string;
    short_description: Map<string, string>;
    description: Map<string, string>;
    card_image: string;
    banner_image: string;
    images: string[];
    video_url: string;
    capital: string;
    language: string;
    currency: string;
    address: {
        name: string;
        lat: number;
        lng: number;
    };
    location: {
        type: 'Point';
        coordinates: [number, number];
    };
    status: boolean;
    is_deleted: boolean;
};
