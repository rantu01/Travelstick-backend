import { HttpStatusCode } from 'axios';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CustomTourRequestService } from './custom-tour-request.service';

export class CustomTourRequestController {
  static createCustomTourRequest = catchAsync(async (req, res) => {
    const { body } = req.body;
    const result = await CustomTourRequestService.createCustomTourRequest(
      body,
    );

    sendResponse(res, {
      statusCode: HttpStatusCode.Created,
      success: true,
      message: 'Custom tour request submitted successfully',
      data: result,
    });
  });

  static getAllCustomTourRequests = catchAsync(async (req, res) => {
    const result = await CustomTourRequestService.getAllCustomTourRequests();

    sendResponse(res, {
      statusCode: HttpStatusCode.Ok,
      success: true,
      message: 'Custom tour requests retrieved successfully',
      data: result,
    });
  });

  static updateCustomTourRequest = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { body } = req.body;
    const result = await CustomTourRequestService.updateCustomTourRequest(
      id,
      body,
    );

    sendResponse(res, {
      statusCode: HttpStatusCode.Ok,
      success: true,
      message: 'Custom tour request updated successfully',
      data: result,
    });
  });

  static deleteCustomTourRequest = catchAsync(async (req, res) => {
    const { id } = req.params;
    await CustomTourRequestService.deleteCustomTourRequest(id);

    sendResponse(res, {
      statusCode: HttpStatusCode.Ok,
      success: true,
      message: 'Custom tour request deleted successfully',
      data: undefined,
    });
  });
}
