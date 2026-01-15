import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TBlog } from './blog.interface';
import { z } from 'zod';
const schema = new Schema<TBlog>(
    {
        title: {
            type: Schema.Types.Map,
            unique: [true, 'Blog title is already exists'],
            of: String,
        },
        short_description: {
            type: Schema.Types.Map,
            of: String,
        },
        description: {
            type: Schema.Types.Map,
            of: String,
        },
        banner_image: String,
        card_image: String,
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'user',
        },
        category: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'blog_category',
        },
        read_time: {
            type: Number,
            default: undefined,
        },
        tags: [
            {
                type: Schema.Types.ObjectId,
                ref: 'blog_tag',
            },
        ],
        is_active: {
            type: Boolean,
            default: true,
        },
        is_latest: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);

const Blog = model<TBlog>('blog', schema);

export default Blog;
