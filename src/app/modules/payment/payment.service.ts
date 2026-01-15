import Payment from './payment.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ClientSession, Types } from 'mongoose';
export class PaymentService {
    static createPayment = async (payload: any, session?: ClientSession) => {
        const data = await Payment.create([payload], { session });
        if (!data) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request Failed !',
                'Failed to create payment Request! Please try again later',
            );
        }
        return data[0];
    };
    static findPaymentByQuery = async (
        filter: Record<string, string | number | boolean | Types.ObjectId>,
        permission: boolean = true,
    ) => {
        const data = await Payment.findOne(filter).select('-__v').lean();
        if (!data && permission) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request Failed !',
                'Failed to find payment request! Please try again later',
            );
        }
        return data;
    };
    static updatePayment = async (
        query: Record<string, string | Types.ObjectId>,
        updateDocument: any,
        session = undefined,
    ) => {
        const options = {
            new: true,
            session,
        };
        const data = await Payment.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return data;
    };
}
