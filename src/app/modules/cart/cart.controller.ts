import { catchAsync } from '../../utils/catchAsync';
import { CartService } from './cart.service';
import { ObjectId } from 'mongodb';
import { ProductService } from '../product/product.service';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import sendResponse from '../../utils/sendResponse';
import { getUserCartCalculation } from './cart.utils';

export class CartController {
    static postCarts = catchAsync(async (req, res) => {
        const { body } = req.body;
        const { user } = res.locals;
        const cartFilter = {
            user: new ObjectId(user._id),
            product: new ObjectId(body.product),
        };
        const cart = await CartService.findCartByQuery(cartFilter, false);
        const quantity: number = body.quantity + (cart ? cart?.quantity : 0);
        const productFilter = {
            _id: new ObjectId(body.product),
            quantity: {
                $gte: quantity,
            },
        };
        const product = await ProductService.findProductByQuery(
            productFilter,
            false,
        );
        if (!product) {
            throw new AppError(
                HttpStatusCode.BadRequest,
                'Request Failed!',
                'The product does not have sufficient quantity.',
            );
        }
        if (cart) {
            cart.quantity = quantity;
            await cart.save();
        } else {
            await CartService.createCart({ ...body, user: user._id });
        }

        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Cart updated successfully',
            data: undefined,
        });
    });
    static getCartsCalculate = catchAsync(async (req, res) => {
        const { user } = res.locals;
        const data = await getUserCartCalculation(user._id);
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Cart get calculate successfully',
            data,
        });
    });
    static getCartsByUser = catchAsync(async (req, res) => {
        const { user } = res.locals;
        const { query }: any = req;
        const filter = {
            user: new ObjectId(user._id),
        };
        if (query._id) {
            const data = await CartService.findCartById(query._id);
            sendResponse(res, {
                statusCode: HttpStatusCode.Ok,
                success: true,
                message: 'Cart get successfully',
                data,
            });
        }
        const select = {
            updatedAt: 0,
            __v: 0,
        };
        const dataList = await CartService.findCartWithPagination(
            filter,
            query,
            select,
        );
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Cart list get successfully',
            data: dataList,
        });
    });
    static deleteCarts = catchAsync(async (req, res) => {
        const { product } = req.params;
        const { user } = res.locals;
        await CartService.deleteCartByQuery({
            user: new ObjectId(user._id),
            product: new ObjectId(product),
        });
        sendResponse(res, {
            statusCode: HttpStatusCode.Ok,
            success: true,
            message: 'Cart deleted successfully',
            data: undefined,
        });
    });
}
