import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TPackageInquiry } from './package-inquiry.interface';

const schema = new Schema<TPackageInquiry>(
    {
        package: {
            type: Schema.Types.ObjectId,
            ref: 'package',
            required: [true, 'package is required'],
        },
        full_name: {
            type: String,
            required: [true, 'full_name is required'],
            index: true,
        },
        email: {
            type: String,
            required: [true, 'email is required'],
            index: true,
        },
        phone: {
            type: String,
            required: [true, 'phone is required'],
        },
        message: {
            type: String,
            required: [true, 'message is required'],
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);

const PackageInquiry = model<TPackageInquiry>('package_inquiry', schema);

export default PackageInquiry;
