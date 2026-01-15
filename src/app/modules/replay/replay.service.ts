import Replay from './replay.model';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

export class ReplayService {
    static async createReplay(payload: any) {
        const data = await Replay.create(payload);
        if (!data) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request failed',
                'Failed to submit the replay request ! please try again',
            );
        }
        return data;
    }
}
