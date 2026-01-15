import { Schema, model } from 'mongoose';
import { TProduct } from './product.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
const schema = new Schema<TProduct>(
    {
        name: {
            type: String,
            required: true,
            index: true,
            unique: [true, 'This product is already exist'],
        },
        description: {
            type: Schema.Types.Map,
            of: String,
            required: true,
        },
        additional_info: {
            type: Schema.Types.Map,
            of: Schema.Types.Mixed,
        },
        images: {
            type: [String],
            default: undefined,
        },
        quantity: {
            type: Number,
            default: 1,
        },
        price: {
            amount: Number,
            discount: Number,
            discount_type: String,
        },
        thumb_image: String,
        status: {
            type: Boolean,
            default: true,
        },
        category: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'project_category',
        },
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);

const Product = model<TProduct>('product', schema);

export default Product;
