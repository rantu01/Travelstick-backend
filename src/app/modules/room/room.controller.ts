import { catchAsync } from '../../utils/catchAsync';
import { RoomService } from './room.service';
import sendResponse from '../../utils/sendResponse';
import { HttpStatusCode } from 'axios';

export class RoomController {
    static createRoom = catchAsync(async (req, res) => {
        const { body } = req.body;
        const data = await RoomService.createRoom(body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Created,
            success: true,
            message: 'Room created successfully',
            data,
        });
    });

    static getRoomsByHotel = catchAsync(async (req, res) => {
        const { hotelId } = req.params;
        const data = await RoomService.findRoomsByHotel(hotelId);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Rooms fetched successfully',
            data,
        });
    });

    static getRoomById = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await RoomService.findRoomById(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Room fetched successfully',
            data,
        });
    });

    static updateRoom = catchAsync(async (req, res) => {
        const { id } = req.params;
        const { body } = req.body;
        const data = await RoomService.updateRoom(id, body);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Room updated successfully',
            data,
        });
    });

    static deleteRoom = catchAsync(async (req, res) => {
        const { id } = req.params;
        await RoomService.deleteRoom(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Room deleted successfully',
            data: undefined,
        });
    });

    static getAllRooms = catchAsync(async (req, res) => {
        const { query } = req;
        const filter = {};
        const data = await RoomService.findAllRooms(filter, query);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Rooms fetched successfully',
            data,
        });
    });

    static getRoomAvailability = catchAsync(async (req, res) => {
        const { id } = req.params;
        const data = await RoomService.getAvailableRoomsCount(id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Room availability fetched successfully',
            data,
        });
    });
}
