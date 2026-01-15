import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { ContactService } from './contact.service';
import { sendUserEmailGeneral } from '../../utils/sendEmail';
import { SettingService } from '../setting/setting.service';

export class ContactController {
    static createContact = catchAsync(async (req, res) => {
        const { body } = req.body;
        const setting = await SettingService.findSettingBySelect({
            site_email: 1,
        });
        await ContactService.postContactByPayload(body);
        const data = {
            email: setting.site_email?.toLowerCase().trim() as string,
            subject: body.subject,
            message: body.message,
        };
        await sendUserEmailGeneral(data);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Message sent successfully',
            data: undefined,
        });
    });
    static sendContactEmailForUser = catchAsync(async (req, res) => {
        const { body } = req.body;
        const data = await ContactService.findContactById(body._id);
        const payload = {
            email: data.email,
            subject: body.subject,
            message: body.message,
        };
        await sendUserEmailGeneral(payload);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Email sent successfully',
            data: undefined,
        });
    });
    static getContactListByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {};
        if (query.search) {
            filter[`$or`] = [
                { name: { $regex: new RegExp(query.search.trim(), 'i') } },
                { email: { $regex: new RegExp(query.search.trim(), 'i') } },
            ];
        }
        if (query._id) {
            const data = await ContactService.findContactById(query._id);

            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Contact get successfully',
                data,
            });
        }
        const dataList = await ContactService.findContactListByQuery(
            filter,
            query,
            false,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Contact list get successfully',
            data: dataList,
        });
    });
    static sendReplay = catchAsync(async (req, res) => {
        const { body } = req.body;
        const contruct =  await ContactService.findContactById(body._id);

        const data = {
            email: contruct.email,
            subject: body.subject,
            message: body.message,
        };
        await ContactService.updateContactById(body._id , {is_replied: true});
        await sendUserEmailGeneral(data);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Message sent successfully',
            data: undefined,
        });
    });
    static deleteContactByAdmin = catchAsync(async (req, res) => {
        const { id } = req.params;
        await ContactService.deleteContactById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Contact deleted successfully',
            data: undefined,
        });
    });
}
