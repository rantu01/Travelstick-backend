import { model, Schema } from 'mongoose';
import { TAdvertisementClick } from './advertisement-click.interface';

const schema = new Schema<TAdvertisementClick>(
    {
        advertisement: {
            type: Schema.Types.ObjectId,
            ref: 'advertisement',
        },
    },
    { timestamps: true },
);

const AdvertisementClick = model<TAdvertisementClick>(
    'advertisement_click',
    schema,
);
export default AdvertisementClick;
