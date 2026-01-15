import { Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { SettingService } from '../setting/setting.service';
import { CartService } from './cart.service';

export const getUserCartCalculation = async (uid: Types.ObjectId) => {
    const filter = {
        user: new ObjectId(uid),
    };
    const setting = await SettingService.findSettingBySelect({
        delivery_charge: 1,
    });
    const cart = await CartService.findCartCalculate(filter);
    return setting.delivery_charge + (cart ? cart.total_price : 0);
};
export const getUserCartProducts = async (uid: Types.ObjectId) => {
    const filter = {
        user: new ObjectId(uid),
    };
    const select = {
        updatedAt: 0,
        __v: 0,
    };
    const dataList = await CartService.findCartWithPagination(
        filter,
        {},
        select,
    );
    const products: any = [];
    dataList.docs.forEach((item: any) => {
        products.push({
            product: new ObjectId(item.product._id),
            quantity: item.quantity,
        });
    });
    return products;
};
