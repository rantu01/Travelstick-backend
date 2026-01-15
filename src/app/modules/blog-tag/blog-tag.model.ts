import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TBlogTag } from './blog-tag.interface';

const schema = new Schema<TBlogTag>(
    {
        name: {
            type: Schema.Types.Map,
            of: String,
        },
        is_deleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const BlogTag = model<TBlogTag>('blog_tag', schema);
export default BlogTag;
