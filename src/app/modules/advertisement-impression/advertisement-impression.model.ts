import { model, Schema } from 'mongoose';
import { TAdvertisementImpression } from './advertisement-impression.interface';

const schema = new Schema<TAdvertisementImpression>(
    {
        advertisement: {
            type: Schema.Types.ObjectId,
            ref: 'advertisement',
        },
    },
    { timestamps: true },
);

const AdvertisementImpression = model<TAdvertisementImpression>(
    'advertisement_impression',
    schema,
);
export default AdvertisementImpression;
