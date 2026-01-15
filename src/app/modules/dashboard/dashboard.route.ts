import { Router } from 'express';
import auth from '../../middleware/auth';
import employeePermission from '../../middleware/employeePermission';
import { DashboardController } from './dashboard.controller';

const router = Router();

router.get(
    '/',
    auth('user', 'admin', 'employee'),
    employeePermission('dashboard_view'),
    DashboardController.getDashboard,
);
router.get('/all-filter', DashboardController.getAllFilter);

export const dashboardRoutes: Router = router;
