import { model, Schema } from 'mongoose';
import { TSettingSection } from './setting-section.interface';

const schema = new Schema<TSettingSection>(
    {
        name: {
            type: String,
            required: true,
            index: true,
        },
        status: {
            type: Boolean,
            default: true,
        },
        content: Schema.Types.Mixed,
    },
    { timestamps: true },
);

const Section = model<TSettingSection>('setting_section', schema);
export default Section;
