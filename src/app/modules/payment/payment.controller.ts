import mongoose from 'mongoose';
import { Stripe } from 'stripe';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { catchAsync } from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SettingService } from '../setting/setting.service';
import { PackageBookingUpdate } from '../package-booking/package-booking.utils';
import { HotelBookingUpdate } from '../hotel-booking/hotel-booking.utils';
import { ProductOrderUpdate } from '../order/order.utils';
import { paypalPaymentInfoDB, razorpayPaymentInfoBD } from './payment.utils';
import { NotificationController } from '../notification/notification.controller';
import { NotificationService } from '../notification/notification.service';
import { HotelBookingService } from '../hotel-booking/hotel-booking.service';

export class PaymentController {
    static updateStripePaymentWithWebhook = catchAsync(
        async (req, res, next) => {
            const settings = await SettingService.findSettingBySelect({
                stripe: 1,
            });
            const stripe = new Stripe(
                settings.stripe?.credentials.stripe_secret_key as string,
            );
            const sig = req.headers['stripe-signature'] as string | string[];
            let event: any;
            try {
                const endpointSecret = settings.stripe?.credentials
                    .stripe_webhook_secret as string;
                event = stripe.webhooks.constructEvent(
                    req.body,
                    sig,
                    endpointSecret,
                );
            } catch (error) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Request Failed !',
                    'web hook provide an error',
                );
            }
            const session = await mongoose.connection.startSession();
            session.startTransaction();
            try {
                const object = event.data.object;
                console.log(object.metadata.booking_id);
                switch (event.type) {
                    case 'checkout.session.completed':
                        if (object.metadata.payment_type === 'package') {
                            await PackageBookingUpdate(
                                object.metadata.booking_id,
                                'completed',
                            );
                        } else if (object.metadata.payment_type === 'hotel') {
                            await HotelBookingUpdate(
                                object.metadata.booking_id,
                                'completed',
                            );
                        } else if (object.metadata.payment_type === 'product') {
                            await ProductOrderUpdate(
                                object.metadata.booking_id,
                                'completed',
                            );
                        }
                        break;
                    case 'checkout.session.expired':
                        if (object.metadata.payment_type === 'package') {
                            await PackageBookingUpdate(
                                object.metadata.booking_id,
                                'expired',
                            );
                        } else if (object.metadata.payment_type === 'hotel') {
                            await HotelBookingUpdate(
                                object.metadata.booking_id,
                                'expired',
                            );
                        } else if (object.metadata.payment_type === 'product') {
                            await ProductOrderUpdate(
                                object.metadata.booking_id,
                                'expired',
                            );
                        }
                        break;
                    case 'checkout.session.async_payment_failed':
                        if (object.metadata.payment_type === 'package') {
                            await PackageBookingUpdate(
                                object.metadata.booking_id,
                                'failed',
                            );
                        } else if (object.metadata.payment_type === 'hotel') {
                            await HotelBookingUpdate(
                                object.metadata.booking_id,
                                'failed',
                            );
                        } else if (object.metadata.payment_type === 'product') {
                            await ProductOrderUpdate(
                                object.metadata.booking_id,
                                'failed',
                            );
                        }
                        break;
                    default:
                        console.log(`Unhandled event type ${event.type}`);
                }
                await session.commitTransaction();
                sendResponse(res, {
                    statusCode: httpStatus.OK,
                    success: true,
                    message: 'Payment completed successfully',
                    data: undefined,
                });
            } catch (error) {
                console.log(error);
                await session.abortTransaction();
                next(error);
            } finally {
                await session.endSession();
            }
        },
    );
    static updatePaypalPayment = catchAsync(async (req, res, next) => {
        const { body } = req.body;
        if (!body.paymentId || !body.PayerID) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request Failed',
                'paymentId and PayerID  is required for paypal payment',
            );
        }
        
        await paypalPaymentInfoDB({
            paymentId: body.paymentId,
            PayerID: body.PayerID,
        });
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Payment completed successfully',
            data: undefined,
        });
    });
    static updateRazorpayPayment = catchAsync(async (req, res, next) => {
        const { body } = req.body;
        if (!body.razorpay_payment_id) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Request Failed',
                'razorpay_payment_id is required',
            );
        }
        await razorpayPaymentInfoBD({
            razorpay_payment_id: body.razorpay_payment_id,
        });
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Payment completed successfully',
            data: undefined,
        });
    });
}
