import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import Service from './service.model';

export class ServiceService {
    static async createManyService(payload: any) {
        return await Service.insertMany(payload);
    }
    static async findServiceById(_id: string | Types.ObjectId) {
        const data = await Service.findById(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Service not found. ! please check your service id and try again ',
            );
        }
        return data;
    }
    static async findServiceByQuery(
        filter: Record<string, string>,
        permission: boolean = true,
    ) {
        const data = await Service.findOne(filter).select('-updatedAt -__v');
        if (!data && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Service not found. ! please check your service id and try again ',
            );
        }
        return data;
    }
    static async findServices(
        filter: Record<string, string | Types.ObjectId>,
        query: Record<string, string | number>,
        select: string | undefined | Record<string, string | number>,
    ) {
        const data = await Service.find(filter)
            .select(select)
            .sort({ createdAt: -1 });
        return data;
    }
    static async updateService(
        query: Record<string, string | boolean | number>,
        updatedDocument: Record<string, string | boolean | number>,
        section = undefined,
    ) {
        const options = {
            section,
            new: true,
        };
        const data = await Service.findOneAndUpdate(
            query,
            updatedDocument,
            options,
        );
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Failed to update service! please try again',
            );
        }
        return data;
    }
}
