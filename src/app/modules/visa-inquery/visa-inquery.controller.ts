import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { VisaInqueryService } from './visa-inquery.service';
import Visa from '../visa/visa.model';

export class VisaInqueryController {
    private static resolveVisaName(title: unknown): string {
        if (!title || typeof title !== 'object') return '';
        const titleMap = title as Record<string, string>;
        return titleMap.en || Object.values(titleMap)[0] || '';
    }

    private static async resolveVisaMeta(payload: Record<string, any>) {
        if (!payload?.visa) return payload;

        const visaDoc = await Visa.findById(payload.visa)
            .select('title visa_type')
            .lean();

        if (!visaDoc) return payload;

        return {
            ...payload,
            visa_type: payload.visa_type || visaDoc.visa_type,
            visa_name:
                payload.visa_name ||
                VisaInqueryController.resolveVisaName(visaDoc.title),
        };
    }

    static postVisaInqueries = catchAsync(async (req, res) => {
        const { body } = req.body;
        const payload = await VisaInqueryController.resolveVisaMeta(body);
        await VisaInqueryService.createVisaInquery(payload);
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

        if (query.inquiry_type === 'inquiry') {
            filter['$or'] = [
                { inquiry_type: 'inquiry' },
                { inquiry_type: { $exists: false } },
                { inquiry_type: null },
            ];
        }

        if (query.inquiry_type === 'apply') {
            filter['inquiry_type'] = 'apply';
        }

        if (query._id) {
            const data = await VisaInqueryService.findVisaInqueryById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Visa inquery get successfully',
                data,
            });
            return;
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

    static postVisaApply = catchAsync(async (req, res) => {
        const { body } = req.body;
        const enriched = await VisaInqueryController.resolveVisaMeta(body);
        await VisaInqueryService.createVisaInquery({
            ...enriched,
            full_name: body.full_name || `${body.given_name} ${body.last_name}`.trim(),
            inquiry_type: 'apply',
        });
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Visa application submitted successfully',
            data: undefined,
        });
    });
}
