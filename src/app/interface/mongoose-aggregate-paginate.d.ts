import 'mongoose';

declare module 'mongoose' {
    interface Model<T> {
        aggregatePaginate?: (
            query: any,
            options?: any,
        ) => Promise<{
            docs: T[];
            totalDocs: number;
            limit: number;
            page?: number;
            totalPages: number;
            pagingCounter: number;
            hasPrevPage: boolean;
            hasNextPage: boolean;
            prevPage?: number | null;
            nextPage?: number | null;
        }>;
    }
}
