export type TOffer = {
    title: Map<string, string>;
    description: Map<string, string>;
    offer_type: string;
    image: string;
    discount_type: string;
    expireAt: Date;
    discount: number;
    status: boolean;
};
