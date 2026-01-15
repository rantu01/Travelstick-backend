import { Document, Types } from 'mongoose';
export interface TBlog extends Document {
    title: Map<string, string>;
    short_description: Map<string, string>;
    description: Map<string, string>;
    banner_image: string;
    card_image: string;
    author: Types.ObjectId;
    category: Types.ObjectId;
    tags: Types.ObjectId[];
    read_time: number;
    is_active: boolean;
    is_latest: boolean;
    is_deleted: boolean;
}
