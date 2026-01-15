import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';

import { DashboardService } from './dashboard.service';
import mongoose from 'mongoose';

export class DashboardController {
    static getDashboard = catchAsync(async (req, res) => {
        const { user } = res.locals;
        let data = null;
        if (user.role == 'user') {
            data = await DashboardService.findDashboardByUser(user);
        } else {
            data = await DashboardService.findDashboard();
        }

        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Get dashboard successfully',
            data,
        });
    });
    static getAllFilter = catchAsync(async (req, res) => {
        const data = await DashboardService.getALlFilter();
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Get Filtered data successfully',
            data,
        });
    });
}
