import User from './user.model';
import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';

export class UserService {
    static async createNewUser(payload: any) {
        const newUser = await User.create(payload);
        if (!newUser) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed',
                'Failed to create account! Please try again.',
            );
        }
        return newUser;
    }
    static async findUserById(_id: string | Types.ObjectId) {
        const user: any = await User.findById(_id)
            .select('-password -__v -updatedAt')
            .lean();
        if (!user) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'User not found!',
            );
        }
        return user;
    }
    static async findUserByPhoneNumber(
        phone: string,
        permission: boolean = true,
    ) {
        const user: any = await User.findOne({ phone }).lean();
        if (!user && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'User not found!',
            );
        }
        return user;
    }
    static async findUserByEmail(email: string, permission: boolean = true) {
        const user = await User.findOne({
            email: email?.trim().toLowerCase(),
        }).lean();
        if (!user && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'User not found!',
            );
        }
        return user;
    }
    static async findUserByEmailOrPhone(
        email: string,
        phone: string,
        permission: boolean = true,
    ) {
        const user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { phone: phone.toLowerCase() },
            ],
        }).lean();
        if (!user && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'User not found!',
            );
        }
        return user;
    }
    static async findUserByQuery(
        filter: Record<string, string>,
        permission: boolean = true,
    ) {
        const user = await User.findOne(filter).select('-password').lean();
        if (!user && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'User not found!',
            );
        }
        return user;
    }
    static async findUserListByQuery(
        filter: any,
        query: Record<string, string | boolean | Types.ObjectId>,
        permission: boolean = true,
    ) {
        const aggregate = User.aggregate([
            {
                $match: filter,
            },
            {
                $lookup: {
                    from: 'hrm_roles',
                    localField: 'permissions',
                    pipeline: [
                        {
                            $project: {
                                _id: 0,
                                name: 1,
                            },
                        },
                    ],
                    foreignField: '_id',
                    as: 'permissions',
                },
            },
            {
                $unwind: {
                    path: '$permissions',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    _id: 1,
                    name: 1,
                    email: 1,
                    phone: 1,
                    role: 1,
                    permissions: 1,
                    image: 1,
                },
            },
        ]);
        const options = {
            page: query.page || 1,
            limit: query.limit || 10,
            sort: { createdAt: -1 },
        };
        const user = await User.aggregatePaginate(aggregate, options);
        if (!user.docs.length && permission) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'User list not found!',
            );
        }
        return user;
    }
    static async updateUserProfile(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: any,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        const updatedUser = await User.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();
        return updatedUser;
    }
    static async updateUserWithFcm(
        query: Record<string, string | Types.ObjectId>,
        updateDocument: any,
        session = undefined,
    ) {
        const options = {
            new: true,
            session,
        };
        return await User.findByIdAndUpdate(
            query,
            { $addToSet: updateDocument },
            options,
        ).lean();
    }
    static async deleteUserById(_id: string | Types.ObjectId) {
        const user = await User.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).lean();
        if (!user) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'User not found!',
            );
        }
        return user;
    }
}
