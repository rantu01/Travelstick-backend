import { Router } from 'express';
import { RoomController } from './room.controller';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';

const router = Router();

router.post(
    '/',
    auth('admin', 'employee'),
    employeePermission('hotel_edit'), // Reusing hotel permission for simplicity
    RoomController.createRoom,
);

router.get('/hotel/:hotelId', RoomController.getRoomsByHotel);
router.get('/:id', RoomController.getRoomById);

router.patch(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('hotel_edit'),
    RoomController.updateRoom,
);

router.delete(
    '/:id',
    auth('admin', 'employee'),
    employeePermission('hotel_delete'),
    RoomController.deleteRoom,
);

router.get('/', auth('admin', 'employee'), RoomController.getAllRooms);

export const roomRoutes: Router = router;
