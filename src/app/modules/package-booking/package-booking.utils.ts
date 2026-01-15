import { generateRandomNumber } from '../../utils/helpers';
import { PackageBookingService } from './package-booking.service';
import { PaymentService } from '../payment/payment.service';
import { NotificationService } from '../notification/notification.service';
import User from '../user/user.model';
import { UserService } from '../user/user.service';
import dayjs from 'dayjs';

export const generateBookingId = async (prefix: string): Promise<string> => {
    const randomString =
        prefix + String.fromCharCode(...generateRandomNumber(7, 32));
    const exists = await PackageBookingService.findPackageBookingByQuery(
        {
            booking_id: randomString,
        },
        false,
    );
    if (exists) {
        console.error('Matched!', randomString);
        return await generateBookingId(prefix);
    }
    return randomString;
};

export const PackageBookingUpdate = async (
    booking_id: string,
    session: string,
) => {
    const user = await UserService.findUserByQuery({role: "admin"});
    const booking =
        await PackageBookingService.findPackageBookingById(booking_id);
      const bookingUpdate =  await PackageBookingService.updatePackageBooking(
        { _id: booking._id },
        { status: session == 'completed' ? 'confirmed' : 'cancelled' },
    );


    if (bookingUpdate.payment.status == "pending") {
        bookingUpdate.payment = await PaymentService.updatePayment(
            { _id: booking.payment },
            { status: session == 'completed' ? 'paid' : 'failed' },
        );
        const data =
            await PackageBookingService.findPackageBookingById(booking_id);
      await  NotificationService.createNotification({
            user: booking.user._id,
            title: 'Package Booking Completed',
            message: 'Your payment completed successfully !',
            type: "package",
          data: data
        });
       await NotificationService.createNotification({
            user: user._id,
           title: `Package Booking Confirmed for ${data.user.name}`,
           message: `${data.user.name} has booked the ${data.package.name.en} package from ${dayjs(data.check_in).format('dddd, MMMM D, YYYY')} to ${dayjs(booking.check_out).format('dddd, MMMM D, YYYY') }`,
            type: "package",
           data: data
        });
    }
};
