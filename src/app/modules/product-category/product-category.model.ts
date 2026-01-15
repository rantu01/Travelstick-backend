import { TProductCategory } from './product-category.interface';
import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TProductCategory>(
    {
        name: {
            type: Schema.Types.Map,
            index: true,
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

const ProductCategory = model<TProductCategory, any>(
    'project_category',
    schema,
);

export default ProductCategory;
