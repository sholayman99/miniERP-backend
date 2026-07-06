import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import productRoutes from '../modules/products/product.routes';
import saleRoutes from '../modules/sales/sale.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';
import roleRoutes from '../modules/roles/role.routes';
import permissionRoutes from '../modules/permissions/permission.routes';
import userRoutes from '../modules/users/user.routes';
import { rlByIp } from '../middleware/rate-limit';

const router = Router();

router.use('/auth', rlByIp('auth', 60, 60), authRoutes);
router.use('/products', productRoutes);
router.use('/sales', rlByIp('sales', 30, 60), saleRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/roles', roleRoutes);
router.use('/permissions', permissionRoutes);
router.use('/users', userRoutes);

export default router;
