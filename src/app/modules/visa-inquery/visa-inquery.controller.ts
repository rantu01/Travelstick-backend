import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { VisaInqueryService } from './visa-inquery.service';

export class VisaInqueryController {
    static postVisaInqueries = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        await VisaInqueryService.createVisaInquery(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Visa Inquery created successfully',
            data: undefined,
        });
    });
    static getVisaInquery = catchAsync(async (req, res) => {
        const { query }: any = req;
        const { user } = res.locals;
        const filter: any = {};
        if (user.role == 'user') {
            filter['email'] = user.email;
        }
        // if (query.search) {
        //     filter[`$or`] = [
        //         { full_name: { $regex: new RegExp(query.search, 'i') } },
        //         { email: { $regex: new RegExp(query.search, 'i') } },

        //     ];
        // }
        if (query._id) {
            const data = await VisaInqueryService.findVisaInqueryById(
                query._id,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Visa inquery get successfully',
                data,
            });
        }
        const select = {
            updatedAt: 0,
            __v: 0,
        };

        const dataList = await VisaInqueryService.findVisaInqueryWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Visa inquery list get successfully',
            data: dataList,
        });
    });

    static deleteVisaTypes = catchAsync(async (req, res) => {
        const { id } = req.params;
        await VisaInqueryService.findVisaInqueryById(id);
        await VisaInqueryService.deleteVisaInqueryById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Visa inquery deleted successfully',
            data: undefined,
        });
    });
}
