import { Router } from 'express';
import validate from '../../middleware/validate';
import auth from '../../middleware/auth';
import { HotelController } from './hotel.controller';
import employeePermission from '../../middleware/employeePermission';
import { HotelValidations } from './hotel.validation';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('hotel_create'),
    validate(HotelValidations.postHotelValidationSchema),
    HotelController.postHotels,
);
router.post(
    '/booking/calculate',
    validate(HotelValidations.postHotelBookingCalculationValidationSchema),
    HotelController.postHotelsBookingCalculation,
);
router.post(
    '/booking',
    auth('user'),
    validate(HotelValidations.postHotelBookingValidationSchema),
    HotelController.postHotelsBooking,
);
router.get(
    '/booking',
    auth('user', 'admin', 'employee'),
    employeePermission('hotel_view'),
    HotelController.getHotelsBooking,
);
router.patch(
    '/booking',
    auth('admin', 'employee'),
    employeePermission('hotel_edit'),
    HotelController.updateHotelsBookingByAdmin,
);

router.get('/sidebar', HotelController.getHotelsForSidebar);
router.get(
    '/',
    auth('admin', 'employee'),
    employeePermission('hotel_view'),
    HotelController.getHotelsByAdmin,
);
router.get('/site', HotelController.getHotelsByPublic);

router.put(
    '/',
    auth('admin', 'employee'),
    employeePermission('hotel_edit'),
    HotelController.updateHotels,
);
router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('hotel_delete'),
    HotelController.deleteHotels,
);

export const hotelRoutes: Router = router;
