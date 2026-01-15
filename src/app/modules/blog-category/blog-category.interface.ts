import { Document } from 'mongoose';
export interface TBlogCategory extends Document {
    name: Map<string, string>;
    description: Map<string, string>;
    is_deleted: boolean;
}
