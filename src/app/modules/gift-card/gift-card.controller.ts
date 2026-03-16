import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { GiftCardService } from './gift-card.service';
import httpStatus from 'http-status';

export class GiftCardController {
    static postGiftCard = catchAsync(async (req, res) => {
        const { body } = req;
        const data = await GiftCardService.createGiftCard(body as any);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Gift card created successfully',
            data,
        });
    });

    static getGiftCardsByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        if (query._id) {
            const data = await GiftCardService.findGiftCardById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Gift card fetched successfully',
                data,
            });
            return;
        }
        const data = await GiftCardService.findGiftCardsWithPagination(filter, query, {});
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Gift cards fetched successfully',
            data,
        });
    });

    static getGiftCardsByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = { status: true };
        const data = await GiftCardService.findGiftCardsWithPagination(filter, query, {});
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Gift cards fetched successfully',
            data,
        });
    });

    static updateGiftCards = catchAsync(async (req, res) => {
        const { body } = req;
        const id = (body as any)._id;
        const data = await GiftCardService.updateGiftCard(id, body as any);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Gift card updated successfully',
            data,
        });
    });

    static deleteGiftCards = catchAsync(async (req, res) => {
        const { id } = req.params;
        await GiftCardService.deleteGiftCard(id as any);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Gift card deleted successfully',
            data: undefined,
        });
    });
}
