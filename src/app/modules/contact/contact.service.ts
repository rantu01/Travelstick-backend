import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import { Types } from 'mongoose';
import Contact from './contact.model';
import { sendUserEmailGeneral } from '../../utils/sendEmail';

export class ContactService {
    static async postContactByPayload(payload: any) {
        const data = await Contact.create(payload);
        if (!data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Can not create new contact ! please try again.',
            );
        }
        return data;
    }
    static async findContactById(_id: Types.ObjectId | string) {
        const data = await Contact.findById(_id).select('-updatedAt -__v');
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Contact can not created! please verify your id and try again.',
            );
        }
        return data;
    }
    static async updateContactById(
        _id: Types.ObjectId | string,
        updateDocument: Record<string , string | boolean | number>,
    ) {
        await Contact.findByIdAndUpdate(
            _id,
            updateDocument,
            { new : true }
        )
    }
    static async findContactListByQuery(
        filter: any,
        query: Record<string, string | boolean | number>,
        permission: boolean = true,
    ) {
        const aggregate = Contact.aggregate([
            {
                $match: filter,
            },
            {
                $project: {
                    __v: 0,
                    updatedAt: 0,
                },
            },
        ]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        return await Contact.aggregatePaginate(aggregate, options);
    }

    static async deleteContactById(_id: string | Types.ObjectId) {
        const data = await Contact.findByIdAndDelete(_id);
        if (!data) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request failed !',
                'Contact not found. please verify your id and try again.',
            );
        }
        return data;
    }
}
