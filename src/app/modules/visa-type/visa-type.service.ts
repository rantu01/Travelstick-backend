import { Types } from 'mongoose';
import { HttpStatusCode } from 'axios';
import VisaType from './visa-type.model';
import AppError from '../../errors/AppError';

export class VisaTypeService {
    static async createVisaType(payload: any) {
        const data = await VisaType.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Failed to create visa type. Please check all the fields and try again',
            );
        }
        return data;
    }
    static async findVisaTypeById(_id: string | Types.ObjectId) {
        const data = await VisaType.findById(_id).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Visa type not found. Please check visa type id and try again',
            );
        }
        return data;
    }
    static async findVisaTypeByQuery(
        query: Record<string, string | boolean | number | Types.ObjectId>,
        permission: boolean = true,
    ) {
        const data = await VisaType.findOne(query).select(
            '-updatedAt -__v -is_deleted',
        );
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Visa type not found. Please check and try again',
            );
        }
        return data;
    }
    static async findVisaTypeWithPagination(
        filter: Record<string, string | boolean | number>,
        query: Record<string, string | boolean | number>,
        select: Record<string, string | boolean | number>,
    ) {
        const aggregate = VisaType.aggregate([
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
        return await VisaType.aggregatePaginate(aggregate, options);
    }
    static async updateVisaType(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await VisaType.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Failed to update visa type! please try again',
            );
        }
        return data;
    }
    static async deleteVisaTypeById(_id: string | Types.ObjectId) {
        const data = await VisaType.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).select('-updatedAt -__v');
        return data;
    }
}
