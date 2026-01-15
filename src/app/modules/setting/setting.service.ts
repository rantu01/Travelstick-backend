import Setting from './setting.model';
import AppError from '../../errors/AppError';
import { Types } from 'mongoose';

export class SettingService {
    static async updateSetting(payload: any) {
        await Setting.findOneAndUpdate({}, payload, { upsert: true });
    }
    public static async findSettingBySelect(
        select: Record<string, string | number>,
        permission: boolean = true,
    ) {
        const setting = await Setting.findOne({}).select(select);
        if (!setting && permission) {
            throw new AppError(404, 'Request failed', 'Settings not found!');
        }
        return setting;
    }
}
