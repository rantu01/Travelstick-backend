import { TRole } from './hrm-role.interface';
import Role from './hrm-role.model';
import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
export class HrmRoleService {
    static postRoles = async (payload: TRole): Promise<void> => {
        await Role.create(payload);
    };
    static findRolebyId = async (_id: string | Types.ObjectId) => {
        const role = await Role.findOne({ _id: _id }).select(
            '-__v -is_deleted',
        );
        if (!role) {
            throw new AppError(404, 'Request failed', 'Role not found');
        }
        return role;
    };

    static findRoleByQuery = async (
        query: Record<string, string | boolean | Types.ObjectId>,
        permission: boolean = true,
    ) => {
        const role = await Role.findOne(query).select('-__v -is_deleted');
        if (!role && permission) {
            throw new AppError(404, 'Request failed', 'Role not found');
        }
        return role;
    };
    static findRoleListByQuery = async (
        query: Record<string, string | boolean | Types.ObjectId>,
        permission: boolean = true,
    ) => {
        const roles = await Role.find(query)
            .select('-updatedAt -__v -is_deleted')
            .sort({ createdAt: -1 });
        if (!roles && permission) {
            throw new AppError(404, 'Request failed', 'Role not found');
        }
        return roles;
    };
    static updateRoleByQuery = async (
        query: Record<string, string | Types.ObjectId>,
        updateDocument: any,
        session = undefined,
    ) => {
        const options = {
            new: true,
            session,
        };
        const role = await Role.findOneAndUpdate(
            query,
            updateDocument,
            options,
        ).lean();

        return role;
    };
    static deleteRoleById = async (_id: string | Types.ObjectId) => {
        const role = await Role.findByIdAndUpdate(_id, {
            is_deleted: true,
        }).lean();
        if (!role) {
            throw new AppError(
                HttpStatusCode.NotFound,
                'Request Failed',
                'Role not found!',
            );
        }
        return role;
    };
}
