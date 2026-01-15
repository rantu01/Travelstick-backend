import { model, Schema } from 'mongoose';
import { TTestimonial } from './testimonial.interface';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';

const schema = new Schema<TTestimonial>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: true,
        },
        status: {
            type: Boolean,
            default: false,
        },
        rating: {
            type: Number,
            required: [true, 'Review rating should be required'],
            min: [1, 'Review rating must be greater than or equal 1'],
            max: [5, 'Review rating must be less than or equal 1'],
        },
        comment: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);
schema.plugin(aggregatePaginate);
const Testimonial = model<TTestimonial>('testimonial', schema);
export default Testimonial;
