import { Types } from 'mongoose';
import Room from './room.model';
import { TRoom } from './room.interface';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';

export class RoomService {
    static async createRoom(payload: TRoom) {
        const data = await Room.create(payload);
        return data;
    }

    static async findRoomsByHotel(hotelId: string | Types.ObjectId) {
        const data = await Room.find({ hotel: hotelId, status: true }).lean();
        return data;
    }

    static async findRoomById(id: string | Types.ObjectId) {
        const data = await Room.findById(id).lean();
        if (!data) {
            throw new AppError(HttpStatusCode.NotFound, 'Request failed!', 'Room not found!');
        }
        return data;
    }

    static async updateRoom(id: string | Types.ObjectId, payload: Partial<TRoom>) {
        const data = await Room.findByIdAndUpdate(id, payload, { new: true }).lean();
        return data;
    }

    static async deleteRoom(id: string | Types.ObjectId) {
        const data = await Room.findByIdAndDelete(id);
        return data;
    }

    static async findAllRooms(filter: any, query: any) {
        const aggregate = Room.aggregate([{ $match: filter }]);
        const options = {
            page: +query.page || 1,
            limit: +query.limit || 10,
            sort: { createdAt: -1 },
        };
        return await Room.aggregatePaginate(aggregate, options);
    }
}
