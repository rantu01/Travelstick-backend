import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import GiftCard from './gift-card.model';
import { Types } from 'mongoose';

export class GiftCardService {
    static async createGiftCard(payload: any) {
        const data = await GiftCard.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create new gift card. Please check all the fields and try again',
            );
        }
        return data;
    }

    static async findGiftCardById(_id: Types.ObjectId | string) {
        const data = await GiftCard.findById(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Gift card not found ! please check your id and try again.',
            );
        }
        return data;
    }

    static async findGiftCardByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await GiftCard.findOne(query).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Gift card not found ! please check and try again.',
            );
        }
        return data;
    }

    static async findGiftCardsWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = GiftCard.aggregate([
            { $match: filter },
            { $sort: { createdAt: -1 } },
        ]);
        const options: any = { page: Number(query.page) || 1, limit: Number(query.limit) || 10 };
        const data = await (GiftCard as any).aggregatePaginate(aggregate, options);
        return data;
    }

    static async updateGiftCard(_id: Types.ObjectId | string, payload: any) {
        const data = await GiftCard.findByIdAndUpdate(_id, payload, { new: true }).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Gift card not found ! please check and try again.',
            );
        }
        return data;
    }

    static async deleteGiftCard(_id: Types.ObjectId | string) {
        const data = await GiftCard.findByIdAndDelete(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Gift card not found ! please check and try again.',
            );
        }
        return data;
    }
}
