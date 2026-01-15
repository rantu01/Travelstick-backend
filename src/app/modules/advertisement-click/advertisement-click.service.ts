import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import AdvertisementClick from './advertisement-click.model';
import { Types } from 'mongoose';

export class AdvertisementClickService {
    static async createByPayload(payload: any): Promise<any> {
        const data = await AdvertisementClick.create(payload);
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
        await AdvertisementClick.deleteMany({ _id });
    }
}
