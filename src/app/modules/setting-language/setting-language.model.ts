import { model, Schema } from 'mongoose';
import { TLanguage } from './setting-language.interface';
const schema = new Schema<TLanguage>(
    {
        name: String,
        code: String,
        rtl: Boolean,
        flag: String,
        translations: {
            type: Map,
            of: String,
        },
        active: {
            type: Boolean,
            default: true,
        },
        default: Boolean,
    },
    { timestamps: true },
);
const Language = model<TLanguage>('setting_language', schema);

export default Language;
