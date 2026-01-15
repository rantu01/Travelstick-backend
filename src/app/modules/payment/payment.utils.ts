import Stripe from 'stripe';
import paypal from 'paypal-rest-sdk';
import { SettingService } from '../setting/setting.service';
import AppError from '../../errors/AppError';
import { HttpStatusCode } from 'axios';
import Razorpay from 'razorpay';

import { TPaymentMethodPayload } from './payment.interface';
import { generateRandomNumber } from '../../utils/helpers';
import { PaymentService } from './payment.service';
import httpStatus from 'http-status';
import { PackageBookingUpdate } from '../package-booking/package-booking.utils';
import { HotelBookingUpdate } from '../hotel-booking/hotel-booking.utils';
import { ProductOrderUpdate } from '../order/order.utils';
export const generateTransactionId = async (
    prefix: string,
): Promise<string> => {
    const randomString =
        prefix + String.fromCharCode(...generateRandomNumber(7, 32));
    const exists = await PaymentService.findPaymentByQuery(
        { transaction_id: randomString },
        false,
    );
    if (exists) {
        console.error('Matched!', randomString);
        return await generateTransactionId(prefix);
    }
    return randomString;
};
export const executeStripePayment = async ({
    amount,
    payment_type,
    booking_id,
}: TPaymentMethodPayload) => {
    const setting = await SettingService.findSettingBySelect({});
    console.log(booking_id);
    if (!setting.stripe?.is_active) {
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed with Stripe',
            'Stripe payment method not found.',
        );
    }
    const stripe = new Stripe(setting.stripe.credentials.stripe_secret_key);

    // @ts-ignore
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: setting.currency_code?.toUpperCase() || 'usd',
                    unit_amount: amount * 100,
                    product_data: {
                        name: setting.site_name as string,
                        description: setting.site_description as string,
                    },
                },
                quantity: 1,
            },
        ],

        metadata: {
            booking_id: booking_id,
            payment_type,
        },

        invoice_creation: {
            enabled: true,
        },
        mode: 'payment',
        success_url: `${setting.client_side_url}/payment/${payment_type}/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${setting.client_side_url}/payment/failed?session_id={CHECKOUT_SESSION_ID}`,
    });
    return {
        id: session.id,
        url: session.url,
    };
};
export const executePaypalPayment = async ({
    amount,
    payment_type,
    booking_id,
}: TPaymentMethodPayload): Promise<any> => {
    const setting = await SettingService.findSettingBySelect({});
    if (!setting.paypal?.is_active) {
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed with Stripe',
            'Paypal payment method not found.',
        );
    }
    paypal.configure({
        mode: 'sandbox',
        client_id: setting.paypal.credentials.paypal_client_id as string,
        client_secret: setting.paypal.credentials.paypal_secret_key as string,
    });
    const create_payment_json = {
        intent: 'sale',
        payer: {
            payment_method: 'paypal',
        },
        redirect_urls: {
            return_url: `${setting.client_side_url}/payment/${payment_type}/paypal/success?booking_id=${booking_id}`,
            cancel_url: `${setting.client_side_url}/payment/failed?booking_id=${booking_id}`,
        },
        transactions: [
            {
                item_list: {
                    items: [
                        {
                            name: setting.site_name,
                            price: amount.toString(),
                            currency: setting.currency_code?.toUpperCase(),
                            quantity: 1,
                        },
                    ],
                },
                amount: {
                    currency: setting.currency_code?.toUpperCase(),
                    total: amount.toString(),
                },
                custom: JSON.stringify({
                    booking_id: booking_id,
                    payment_type: payment_type,
                }),
                description: setting.site_description,
            },
        ],
    };
    return new Promise((resolve, reject) => {
        paypal.payment.create(create_payment_json, (error, payment) => {
            if (error) {
                console.log(error);
                const message =
                    error.response?.details?.[0]?.issue || 'Unknown error';
                reject(new Error(`PayPal error: ${message}`));
            } else {
                const amount = payment.transactions[0]?.amount?.total;
                let url = null;
                if (payment.links) {
                    // @ts-ignore
                    url = payment.links.find(
                        (item) => item.rel == 'approval_url',
                    ).href;
                }
                const id = payment.id;
                resolve({
                    url,
                    id,
                });
            }
        });
    });
};

export const executeRazorpayPayment = async ({
    amount,
    payment_type,
    booking_id,
}: TPaymentMethodPayload) => {
    const setting = await SettingService.findSettingBySelect({});
    if (!setting.razorpay?.is_active) {
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed with Stripe',
            'Razorpay payment method not found.',
        );
    }

    const razorpay = new Razorpay({
        key_id: setting.razorpay.credentials.razorpay_key_id,
        key_secret: setting.razorpay.credentials.razorpay_key_secret,
    });
    const notes: {
        booking_id: string | null;
        payment_type: string;
    } = {
        booking_id: booking_id ? booking_id.toString() : null,
        payment_type: payment_type.toString(),
    };
    const link: any = await razorpay.paymentLink.create({
        amount: amount * 100,
        currency: setting.currency_code?.toUpperCase() || 'USD',
        description: setting.site_description,
        customer: {
            name: setting.site_name,
        },
        callback_url: `${setting.client_side_url}/payment/${payment_type}/razorpay/success`,
        callback_method: 'get',
        notes,
    });
    return {
        id: link.id,
        url: link.short_url,
    };
};

export const paypalPaymentInfoDB = async ({
    paymentId,
    PayerID,
}: {
    paymentId: string;
    PayerID: string;
}) => {
    const setting = await SettingService.findSettingBySelect({ paypal: 1 });
    if (!setting.paypal?.is_active) {
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed with Stripe',
            'Paypal payment method not found.',
        );
    }
    paypal.configure({
        mode: 'sandbox',
        client_id: setting.paypal.credentials.paypal_client_id as string,
        client_secret: setting.paypal.credentials.paypal_secret_key as string,
    });

    const execute_payment_json = {
        payer_id: PayerID,
    };
    paypal.payment.execute(
        paymentId,
        execute_payment_json,
        async function (error, payment) {
            if (error) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Request Failed !',
                    'Paypal payment failed',
                );
            } else {
                const transaction = payment.transactions[0];
                if (transaction.custom != null) {
                    const payload = JSON.parse(transaction.custom);
                    if (payload.payment_type === 'package') {
                        await PackageBookingUpdate(
                            payload.booking_id,
                            'completed',
                        );
                    } else if (payload.payment_type === 'hotel') {
                        await HotelBookingUpdate(
                            payload.booking_id,
                            'completed',
                        );
                    } else if (payload.payment_type === 'product') {
                        await ProductOrderUpdate(
                            payload.booking_id,
                            'completed',
                        );
                    }
                }
            }
        },
    );
};

export const razorpayPaymentInfoBD = async ({
    razorpay_payment_id,
}: {
    razorpay_payment_id: string;
}) => {
    const setting = await SettingService.findSettingBySelect({ razorpay: 1 });
    if (!setting.razorpay?.is_active) {
        throw new AppError(
            HttpStatusCode.BadRequest,
            'Request Failed with razorpay',
            'Razorpay payment method not found.',
        );
    }
    const razorpay = new Razorpay({
        key_id: setting.razorpay.credentials.razorpay_key_id,
        key_secret: setting.razorpay.credentials.razorpay_key_secret,
    });

    const paymentIntent = await razorpay.payments.fetch(razorpay_payment_id);
    if (paymentIntent.status !== 'captured') {
        new AppError(400, 'Request Failed', 'Invalid payment status');
    }
    if (paymentIntent.notes.payment_type === 'package') {
        await PackageBookingUpdate(paymentIntent.notes.booking_id, 'completed');
    } else if (paymentIntent.notes.payment_type === 'hotel') {
        await HotelBookingUpdate(paymentIntent.notes.booking_id, 'completed');
    } else if (paymentIntent.notes.payment_type === 'product') {
        await ProductOrderUpdate(paymentIntent.notes.booking_id, 'completed');
    }
};
