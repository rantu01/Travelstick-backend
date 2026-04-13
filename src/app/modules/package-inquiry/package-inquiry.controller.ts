import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { PackageInquiryService } from './package-inquiry.service';

export class PackageInquiryController {
    static postPackageInquiry = catchAsync(async (req, res) => {
        const { body } = req.body;
        await PackageInquiryService.createPackageInquiry(body);

        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Package inquiry submitted successfully',
            data: undefined,
        });
    });

    static getPackageInquiry = catchAsync(async (req, res) => {
        const { query }: any = req;

        if (query._id) {
            const data = await PackageInquiryService.findPackageInquiryById(
                query._id,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Package inquiry get successfully',
                data,
            });
            return;
        }

        const select = {
            updatedAt: 0,
            __v: 0,
        };

        const dataList =
            await PackageInquiryService.findPackageInquiryWithPagination(
                {},
                query,
                select,
            );

        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Package inquiry list get successfully',
            data: dataList,
        });
    });

    static deletePackageInquiry = catchAsync(async (req, res) => {
        const { id } = req.params;
        await PackageInquiryService.findPackageInquiryById(id);
        await PackageInquiryService.deletePackageInquiryById(id);

        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Package inquiry deleted successfully',
            data: undefined,
        });
    });
}
