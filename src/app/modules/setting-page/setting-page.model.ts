import { model, Schema } from 'mongoose';
import { TPage } from './setting-page.interface';

const schema = new Schema<TPage>(
    {
        slug: {
            type: String,
            required: true,
            index: true,
        },
        status: {
            type: Boolean,
        },
        theme: {
            type: String,
            default: 'one',
        },
        content: Schema.Types.Mixed,
    },
    { timestamps: true },
);

const Page = model<TPage>('setting_page', schema);
export default Page;
