import { Router } from 'express';
import { PaymentController } from './payment.controller';

const router = Router();

router.post(
    '/stripe/webhook',
    PaymentController.updateStripePaymentWithWebhook,
);
router.patch('/paypal', PaymentController.updatePaypalPayment);
router.patch('/razorpay', PaymentController.updateRazorpayPayment);

export const paymentRoutes: Router = router;
