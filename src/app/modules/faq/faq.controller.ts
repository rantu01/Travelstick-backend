import { FaqService } from './faq.service';
import { HttpStatusCode } from 'axios';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';

export class FaqController {
    static createFaq = catchAsync(async (req, res) => {
        const { body }: any = req.body;
        const exist = await FaqService.findFaqByQuery(
            { question: body.question },
            false,
        );
        if (exist) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed !',
                'Question is already exist',
            );
        }

        await FaqService.createFaq(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Faq has been created successfully',
            data: undefined,
        });
    });
    static getFaqs = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        const langCode = query.langCode || 'en';
        if (query?.search) {
            filter[`question.${langCode}`] = {
                $regex: new RegExp(query.search, 'i'),
            };
        }
        let data = null;
        if (query?._id) {
            data = await FaqService.findFaqById(query._id);
        } else {
            data = await FaqService.findFaqListByQuery(filter, {});
        }
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: `Faq ${query._id ? '' : 'list'} get successfully`,
            data,
        });
    });
    static updateFaqsByAdmin = catchAsync(async (req, res) => {
        const { body }: any = req.body;
        await FaqService.findFaqById(body._id);
        await FaqService.updateFaq({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Faq updated successfully',
            data: undefined,
        });
    });
    static deleteFaqsByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await FaqService.deleteFaqById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Faq has been deleted successfully',
            data: undefined,
        });
    });
}
