import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import VisaInquery from './visa-inquery.model';

export class VisaInqueryService {
    static async createVisaInquery(payload: any) {
        const data = await VisaInquery.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create visa inquery. Please check all the fields and try again',
            );
        }
        return data;
    }
    static async findVisaInqueryById(_id: string | Types.ObjectId) {
        const data = await VisaInquery.findById(_id)
            .populate('visa_type', 'name')
            .select('-updatedAt -__v ');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Visa inquery not found. Please check visa inquery id and try again',
            );
        }
        return data;
    }
    static async findVisaInqueryByQuery(
        query: Record<string, string | boolean | number | Types.ObjectId>,
        permission: boolean = true,
    ) {
        const data =
            await VisaInquery.findOne(query).select('-updatedAt -__v ');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Visa inquery not found. Please check and try again',
            );
        }
        return data;
    }
    static async findVisaInqueryWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number |any>,
        select: Record<string, string | boolean | number>,
    ) {
        console.log(query);
        const searchTerm = query.search?.toString() || '';
        const aggregate = VisaInquery.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'visa_types',
                    localField: 'visa_type',
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                            },
                        },
                    ],
                    foreignField: '_id',
                    as: 'visa_type',
                },
            },
            {
                $unwind: {
                    path: '$visa_type',
                    preserveNullAndEmptyArrays: true,
                },
            },
            ...(query.search ? [
                {
                    $match: {
                        $or: [
                            { [`visa_type.name.${query.langCode || 'en'}`]: { $regex: searchTerm.toLowerCase(), $options: 'i' } },
                            { [`email`]: { $regex: searchTerm, $options: 'i' } },
                            { [`full_name`]: { $regex: searchTerm, $options: 'i' } }
                        ]
                    }
                }
            ] : []),
            {
                $project: select,
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        return await VisaInquery.aggregatePaginate(aggregate, options);
    }

    static async deleteVisaInqueryById(_id: string | Types.ObjectId) {
        const data =
            await VisaInquery.findByIdAndDelete(_id).select('-updatedAt -__v');
        return data;
    }
}
