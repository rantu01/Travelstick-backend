import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import AdvertisementImpression from './advertisement-impression.model';

export class AdvertisementImpressionService {
    static async createByPayload(payload: any): Promise<any> {
        const data = await AdvertisementImpression.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create advertisement click! Please try again.',
            );
        }
        return data;
    }
    static async deleteManyById(_id: string | Types.ObjectId): Promise<any> {
        return await AdvertisementImpression.deleteMany({ _id });
    }
}
