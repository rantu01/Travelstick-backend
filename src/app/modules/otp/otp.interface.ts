export type TOtp = {
    email: string;
    phone: string;
    code: string;
    action: string;
    attempts: number;
    expireAt: Date;
};
