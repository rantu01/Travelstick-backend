import { model, Schema } from 'mongoose';
import { TBlogCategory } from './blog-category.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
const schema = new Schema<TBlogCategory>(
    {
        name: {
            type: Schema.Types.Map,
            of: String,
        },
        description: {
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

const BlogCategory = model<TBlogCategory>('blog_category', schema);

export default BlogCategory;
