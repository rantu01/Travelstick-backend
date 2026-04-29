import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TVisaInquery } from './visa-inquery.interface';
const schema = new Schema<TVisaInquery>(
    {
        full_name: {
            type: String,
            index: true,
        },
        email: String,
        phone: String,
        visa_type: {
            type: Schema.Types.ObjectId,
            ref: 'visa_type',
        },
        visa_type_name: String,
        visa_name: String,
        message: String,
        file: String,
        visa: {
            type: Schema.Types.ObjectId,
            ref: 'visa',
        },
        appointment_date: Date,
        number_of_applicants: {
            type: Number,
            default: 1,
        },
        price_per_person: {
            type: Number,
            default: 0,
        },
        total_price: {
            type: Number,
            default: 0,
        },
        given_name: String,
        last_name: String,
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
        date_of_birth: Date,
        nationality: String,
        visited_countries: String,
        passport_number: String,
        passport_expiry_date: Date,
        profession: String,
        local_address: String,
        foreign_address: String,
        inquiry_type: {
            type: String,
            enum: ['inquiry', 'apply'],
            default: 'inquiry',
        },
    },
    { timestamps: true },
);

schema.plugin(aggregatePaginate);

const VisaInquery = model<TVisaInquery>('visa_inquery', schema);

export default VisaInquery;
