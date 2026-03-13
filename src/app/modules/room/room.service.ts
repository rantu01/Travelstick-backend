import { Types } from 'mongoose';
import Room from './room.model';
import HotelBooking from '../hotel-booking/hotel-booking.model';
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

    // Returns available (unboooked) count for a room type
    static async getAvailableRoomsCount(roomId: string | Types.ObjectId) {
        const room = await Room.findById(roomId).lean();
        if (!room) {
            throw new AppError(HttpStatusCode.NotFound, 'Request failed!', 'Room not found!');
        }
        const totalRooms = room.total_rooms ?? 1;

        // Sum up rooms_count from active (pending/confirmed) bookings for this room
        const result = await HotelBooking.aggregate([
            { $match: { status: { $in: ['pending', 'confirmed'] } } },
            { $unwind: '$room_details' },
            {
                $match: {
                    'room_details.room': new Types.ObjectId(String(roomId)),
                },
            },
            {
                $group: {
                    _id: null,
                    booked: { $sum: '$room_details.count' },
                },
            },
        ]);

        const bookedCount = result[0]?.booked ?? 0;
        const available = Math.max(0, totalRooms - bookedCount);
        return { total: totalRooms, booked: bookedCount, available };
    }
}
