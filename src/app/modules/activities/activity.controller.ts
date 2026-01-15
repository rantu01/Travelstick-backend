import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { ActivityService } from './activity.service';
import { sendUserEmailGeneral } from '../../utils/sendEmail';
import { SettingService } from '../setting/setting.service';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

export class ActivityController {
    static postActivities = catchAsync(async (req, res) => {
        const { body } = req.body;
        const data = await ActivityService.findActivityByQuery(
            {
                name: body.name,
                is_deleted: false,
            },
            false,
        );
        if (data) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Resuest Failed !',
                'Activity already exists ! please change activity name',
            );
        }
        await ActivityService.createActivity(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Activity created successfully',
            data: undefined,
        });
    });
    static getActivitiesByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_deleted: false,
        };
        const longCode = query.langCode || 'en';
        if (query.search) {
            filter[`$or`] = [
                { [`name.${longCode}`]: { $regex: new RegExp(query.search.trim(), 'i') } },
            ];
        }
        if (query._id) {
            const data = await ActivityService.findActivityById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Activity get successfully',
                data,
            });
        }
        const select = {
            is_deleted: 0,
            updatedAt: 0,
            __v: 0,
        };
        const dataList = await ActivityService.findActivitiesWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Activity list get successfully',
            data: dataList,
        });
    });
    static updateActivities = catchAsync(async (req, res) => {
        const { body } = req.body;
        await ActivityService.findActivityById(body._id);
        await ActivityService.updateActivity({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Activity updated successfully',
            data: undefined,
        });
    });
    static deleteActivities = catchAsync(async (req, res) => {
        const { id } = req.params;
        await ActivityService.deleteActivityById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Activity deleted successfully',
            data: undefined,
        });
    });
}
