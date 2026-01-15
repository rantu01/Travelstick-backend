import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { HttpStatusCode } from 'axios';
import { SubscriberService } from './subscriber.service';
import AppError from '../../errors/AppError';
import { createThread } from '../../utils/createThread';
import path from 'node:path';
export class SubscriberController {
    static createSubscriber = catchAsync(async (req, res) => {
        const { body } = req.body;
        const data = await SubscriberService.findSubscriberByQuery(
            { email: body.email },
            {},
            false,
        );
        if (data) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request failed',
                'Subscriber already exists',
            );
        }
        await SubscriberService.createSubscribers(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Successfully subscribed.',
            data: undefined,
        });
    });
    static getSubscriberListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        let data = null;
        const filter: any = {};
        if (query?.search) {
            filter['$or'] = [
                { email: { $regex: query.search, $options: 'i' } },
            ];
        }
        if (query._id) {
            data = await SubscriberService.findSubscriberByQuery(
                { _id: query._id },
                {},
                true,
            );
        } else {
            data = await SubscriberService.findSubscriberListByQuery(
                filter,
                query,
                false,
            );
        }
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: `Get Subscriber ${query._id ? '' : 'list'} Successfully`,
            data,
        });
    });
    static deleteSubscriberByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await SubscriberService.deleteSubscriberById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Subscriber deleted successfully',
            data: undefined,
        });
    });
    static sendEmailByAdmin = catchAsync(async (req, res) => {
        const { body } = req.body;
        // eslint-disable-next-line no-undef
        const emailWorkerPath = path.join(
            __dirname,
            '../../utils',
            'emailWorker.ts',
        );
        if (body._id) {
            const subscriber = await SubscriberService.findSubscriberByQuery(
                { _id: body._id },
                {},
            );
            const data = {
                email: subscriber.email.toLowerCase(),
                subject: body.subject,
                message: body.subject,
            };
            await createThread(emailWorkerPath, [data]);
        } else {
            const subscriber =
                await SubscriberService.findSubscriberListByQuery(
                    {},
                    {},
                    false,
                );
            const emailData = subscriber.docs.map((doc: any) => {
                return {
                    email: doc.email.toLowerCase(),
                    subject: body.subject,
                    message: body.subject,
                };
            });
            await createThread(emailWorkerPath, emailData);
        }
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Email sent successfully',
            data: undefined,
        });
    });
}
