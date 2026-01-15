import { model, Schema } from 'mongoose';
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { TContact } from './contact.interface';

const schema = new Schema<TContact>(
    {
        name: String,
        email: String,
        subject: String,
        message: String,
        is_replied:{
            type: Boolean,
            default: false
        }
    },
    { timestamps: true },
);
schema.plugin(aggregatePaginate);
const Contact = model<TContact>('contact', schema);
export default Contact;
