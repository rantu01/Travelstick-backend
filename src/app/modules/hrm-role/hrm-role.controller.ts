import { catchAsync } from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { HrmRoleService } from './hrm-role.service';
import sendResponse from '../../utils/sendResponse';
import { HttpStatusCode } from 'axios';
import permissions from './hrm-role.utils';
import { UserService } from '../user/user.service';

export class RoleController {
    static postHRMRoles = catchAsync(async (req, res) => {
        const { body } = req.body;
        const filter: any = {
            name: body.name,
            is_deleted: false,
        };

        const existingRole = await HrmRoleService.findRoleByQuery(
            filter,
            false,
        );
        if (existingRole) {
            throw new AppError(400, 'Request Failed', 'Role already exists');
        }

        await HrmRoleService.postRoles(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Created new role successfully',
            data: undefined,
        });
    });
    static findRoleByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        let data = null;
        const filter: any = {
            is_deleted: false,
        };
        if (query?.search) {
            filter['name'] = { $regex: query.search, $options: 'i' };
        }
        if (query._id) {
            data = await HrmRoleService.findRolebyId(query._id);
            if (!data) {
                throw new AppError(400, 'Request Failed', "Role can't exists");
            }
        } else {
            data = await HrmRoleService.findRoleListByQuery(filter);
        }

        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: `Get HRM role ${!query?._id ? 'list' : ''} Successfully`,
            data,
        });
    });
    static findPermissionsByAdmin = catchAsync(async (req, res) => {
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Successfully gets permissions',
            data: permissions,
        });
    });
    static updateHRMPermissions = catchAsync(async (req, res) => {
        const { body } = req.body;
        const role: any = await HrmRoleService.findRoleByQuery({
            _id: body.role,
        });
        const mergedPermissions = Array.from(
            new Set([...role.permissions, ...body.permissions]),
        );
        const isAlreadyUpdated =
            JSON.stringify(role.permissions.sort()) ===
            JSON.stringify(mergedPermissions.sort());
        if (isAlreadyUpdated) {
            sendResponse(res, {
                statusCode: 200,
                success: true,
                message: 'Permissions are already updated',
                data: undefined,
            });
        }
        await HrmRoleService.updateRoleByQuery(
            { _id: body.role },
            { permissions: mergedPermissions },
        );
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Successfully updated permissions',
            data: undefined,
        });
    });
    static updateHRMRoles = catchAsync(async (req, res) => {
        const { body } = req.body;
        const filter: any = {
            _id: body._id,
            is_deleted: false,
        };
        const existingRole = await HrmRoleService.findRoleByQuery(
            filter,
            false,
        );
        if (!existingRole) {
            throw new AppError(400, 'Request Failed', 'Role can not exists');
        }
        await HrmRoleService.updateRoleByQuery({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Update role successfully',
            data: undefined,
        });
    });
    static deleteHRMRoles = catchAsync(async (req, res) => {
        const { _id }: any = req.params;
        const filter: any = {
            _id: _id,
            is_deleted: false,
        };
        const existingRole = await HrmRoleService.findRoleByQuery(
            filter,
            false,
        );
        if (!existingRole) {
            throw new AppError(404, 'Request failed', 'Role not exists!');
        }
        await HrmRoleService.deleteRoleById(_id);
        sendResponse(res, {
            statusCode: 200,
            success: true,
            message: 'Role deleted successfully',
            data: undefined,
        });
    });
}
