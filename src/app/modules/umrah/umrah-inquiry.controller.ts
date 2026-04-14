import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { UmrahInquiryService } from './umrah-inquiry.service';

export class UmrahInquiryController {
    static createUmrahInquiry = catchAsync(async (req, res) => {
        const { body } = req.body;
        const result = await UmrahInquiryService.createUmrahInquiry(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Umrah inquiry submitted successfully',
            data: result,
        });
    });

    static getAllUmrahInquiries = catchAsync(async (req, res) => {
        const result = await UmrahInquiryService.getAllUmrahInquiries();
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Umrah inquiries retrieved successfully',
            data: result,
        });
    });

    static getSingleUmrahInquiry = catchAsync(async (req, res) => {
        const { id } = req.params;
        const result = await UmrahInquiryService.getSingleUmrahInquiry(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Umrah inquiry retrieved successfully',
            data: result,
        });
    });

    static updateUmrahInquiry = catchAsync(async (req, res) => {
        const { id } = req.params;
        const { body } = req.body;
        const result = await UmrahInquiryService.updateUmrahInquiry(id, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Umrah inquiry updated successfully',
            data: result,
        });
    });

    static deleteUmrahInquiry = catchAsync(async (req, res) => {
        const { id } = req.params;
        await UmrahInquiryService.deleteUmrahInquiry(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Umrah inquiry deleted successfully',
            data: undefined,
        });
    });
}