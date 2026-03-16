export type TGiftCard = {
    title: Map<string, string>;
    subtitle?: Map<string, string>;
    code?: string;
    image?: string;
    price?: number;
    applicable_service?: string;
    status?: boolean;
};
