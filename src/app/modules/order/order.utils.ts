import { generateRandomNumber } from '../../utils/helpers';
import { OrderService } from './order.service';

import { PaymentService } from '../payment/payment.service';
import Order from './order.model';

import { ProductService } from '../product/product.service';
import { NotificationService } from '../notification/notification.service';
import User from '../user/user.model';
import { UserService } from '../user/user.service';
import dayjs from 'dayjs';

export const generateOrderID = async (prefix: string): Promise<any> => {
    const randomString =
        prefix + String.fromCharCode(...generateRandomNumber(7, 32)).toString();
    const exists = await Order.findOne({
        orderId: randomString,
    });
    if (exists) {
        console.error('Matched!', randomString);
        return await generateOrderID(prefix);
    }
    return randomString;
};
const updateProductQuantityBYProducts = async (products: any): Promise<any> => {
    products.forEach((item: any) => {
        ProductService.updateProduct(
            { _id: item.product },
            { $inc: { quantity: -item.quantity } },
        );
    });
};

export const ProductOrderUpdate = async (order_id: string, session: string) => {
    const user = await UserService.findUserByQuery({ role: "admin" });
    const order = await OrderService.findOrderById(order_id);
    const orderUpdate =  await OrderService.updateOrder(
        { _id: order._id },
        { status: session == 'completed' ? 'confirmed' : 'cancelled' },
    );
    
    if (orderUpdate.payment.status == "pending") {
        orderUpdate.payment  = await PaymentService.updatePayment(
            { _id: order.payment },
            { status: session == 'completed' ? 'paid' : 'failed' },
        );
        const data = await OrderService.findOrderById(order_id);

        
        await updateProductQuantityBYProducts(order.products);
        await NotificationService.createNotification({
            user: order.user._id,
            title: 'Product Order Completed',
            message: 'Your payment completed successfully !',
            type: "order",
            data: data.toObject()
        });
        await  NotificationService.createNotification({
            user: user._id,
            title: `Product order confirmed for ${data.user.name}`,
            message: `${data.user.name} has ordered products ${dayjs(data.createdAt).format('dddd, MMMM D, YYYY')}`,
            type: "order",
            data: data.toObject()
        });
    }


};
