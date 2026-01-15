export type TLanguage = {
    name: string;
    code: string;
    rtl: boolean;
    flag: string;
    translations: Map<string, string>;
    active: boolean;
    default: boolean;
};
