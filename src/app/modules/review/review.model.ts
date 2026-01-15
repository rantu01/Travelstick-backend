import { model, Schema } from 'mongoose';

import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TReviewPackage } from './review.interface';

const schema = new Schema<TReviewPackage>(
    {
        location: {
            type: Number,
            default: 3,
            min: [1, 'location rating must be greater than or equal 1'],
            max: [5, 'location rating must be less than or equal 5'],
        },
        service: {
            type: Number,
            default: 3,
            min: [1, 'service rating must be greater than or equal 1'],
            max: [5, 'service rating must be less than or equal 5'],
        },
        amenities: {
            type: Number,
            default: 3,
            min: [1, 'Amenities rating must be greater than or equal 1'],
            max: [5, 'Amenities rating must be less than or equal 5'],
        },
        price: {
            type: Number,
            default: 3,
            min: [1, 'price rating must be greater than or equal 1'],
            max: [5, 'price rating must be less than or equal 5'],
        },
        room: {
            type: Number,
            default: 3,
            min: [1, 'room rating must be greater than or equal 1'],
            max: [5, 'room rating must be less than or equal 5'],
        },
        comment: {
            type: String,
            trim: true,
            default: undefined,
        },
        status: {
            type: Boolean,
            default: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
        },
        package: {
            type: Schema.Types.ObjectId,
            ref: 'package',
        },
        hotel: {
            type: Schema.Types.ObjectId,
            ref: 'hotel',
        },
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const ReviewPackage = model<TReviewPackage>('package_review', schema);
export default ReviewPackage;
