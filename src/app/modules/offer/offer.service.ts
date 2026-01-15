import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import Destination from './offer.model';
import { Types } from 'mongoose';
import Offer from './offer.model';

export class OfferService {
    static async createOffer(payload: any) {
        const data = await Offer.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create new offer. Please check all the fields and try again',
            );
        }
    }
    static async findOfferById(_id: Types.ObjectId | string) {
        const data = await Offer.findById(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Offer not found ! please check your id and try again.',
            );
        }
        return data;
    }
    static async findOfferByQuery(
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const data = await Offer.findOne(query).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Offer not found ! please check and try again.',
            );
        }
        return data;
    }
    static async findOffersWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = Offer.aggregate([
            {
                $match: filter,
            },
            {
                $project: select,
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        return await Offer.aggregatePaginate(aggregate, options);
    }
    static async findOffers(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const data = await Offer.find(filter)
            .select(select)
            .sort({ createdAt: -1 });
        return data;
    }
    static async updateOffer(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: Record<string, string | Types.ObjectId>,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const data = await Offer.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return data;
    }

    static async deleteOfferById(_id: string | Types.ObjectId) {
        const data = await Offer.findByIdAndDelete(_id);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Offer not found ! please check your id and try again.',
            );
        }
        return data;
    }
}
