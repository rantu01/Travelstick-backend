import { catchAsync } from '../../utils/catchAsync';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { DestinationService } from './destination.service';
import { sendUserEmailGeneral } from '../../utils/sendEmail';
import { SettingService } from '../setting/setting.service';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { PackageService } from '../package/package.service';
import { ObjectId } from 'mongodb';
import { HotelService } from '../hotel/hotel.service';

export class DestinationController {
    static postDestinations = catchAsync(async (req, res) => {
        const { body } = req.body;
        const data = await DestinationService.findDestinationByQuery(
            {
                name: body.name,
                is_deleted: false,
            },
            false,
        );
        if (data) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Resuest Failed !',
                'Destination already exists ! please change your destination name',
            );
        }
        body.location = {
            type: 'Point',
            coordinates: [body.address.lat, body.address.lng],
        };
        await DestinationService.createDestination(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Destination created successfully',
            data: undefined,
        });
    });
    static getDestinationsByAdmin = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            is_deleted: false,
        };
        if (query.search) {
            filter[`$or`] = [
                { name: { $regex: new RegExp(query.search.trim(), 'i') } },
                { country: { $regex: new RegExp(query.search.trim(), 'i') } },
                { city: { $regex: new RegExp(query.search.trim(), 'i') } },
            ];
        }
        if (query._id) {
            const data = await DestinationService.findDestinationById(
                query._id,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Destination get successfully',
                data,
            });
        }
        const select = {
            is_deleted: 0,
            updatedAt: 0,
            __v: 0,
        };
        const dataList =
            await DestinationService.findDestinationsWithPagination(
                filter,
                query,
                select,
            );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Destination list get successfully',
            data: dataList,
        });
    });
    static getDestinationsByPublic = catchAsync(async (req, res) => {
        const { query }: any = req;
        const filter: any = {
            status: true,
            is_deleted: false,
        };

        if (query._id) {
            const data = await DestinationService.findDestinationById(
                query._id,
            );
            const filter = {
                ['destination._id']: new ObjectId(query._id),
            };
            const select = {
                __v: 0,
                updateAt: 0,
            };
            const packageList = await PackageService.findPackagesWithPagination(
                filter,
                query,
                select,
            );
            const hotelList = await HotelService.findHotelsWithPagination(
                filter,
                query,
                select,
            );
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Destination get successfully',
                data: {
                    ...data,
                    packages: packageList.docs,
                    hotels: hotelList.docs,
                },
            });
        }
        const select = {
            name: 1,
            address: 1,
            short_description: 1,
            description:1,
            card_image: 1,
            banner_image: 1,
        };
        const dataList =
            await DestinationService.findDestinationsWithPagination(
                filter,
                query,
                select,
            );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Destination list get successfully',
            data: dataList,
        });
    });
    static updateDestinations = catchAsync(async (req, res) => {
        const { body } = req.body;
        await DestinationService.findDestinationById(body._id);
        if (body.address) {
            body.location = {
                type: 'Point',
                coordinates: [body.address.lat, body.address.lng],
            };
        }
        await DestinationService.updateDestination({ _id: body._id }, body);
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Destination updated successfully',
            data: undefined,
        });
    });
    static deleteDestinations = catchAsync(async (req, res) => {
        const { id } = req.params;
        await DestinationService.deleteDestinationById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Destination deleted successfully',
            data: undefined,
        });
    });
}
