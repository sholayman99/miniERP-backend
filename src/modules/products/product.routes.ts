import { Router } from 'express';
import { requireAuth } from '../../middleware/require-auth';
import { requirePermission } from '../../middleware/require-permission';
import { validateBody, validateQuery } from '../../middleware/validate';
import { uploadProductImage } from '../../lib/upload';
import {
  createProductSchema,
  updateProductSchema,
  listProductsQuerySchema,
} from './product.validation';
import * as controller from './product.controller';

const router = Router();
router.use(requireAuth());

router.get(
  '/',
  requirePermission('products:read'),
  validateQuery(listProductsQuerySchema),
  controller.listProductsHandler
);
router.get(
  '/:id',
  requirePermission('products:read'),
  controller.getProductHandler
);
router.post(
  '/',
  requirePermission('products:create'),
  uploadProductImage.any(),
  validateBody(createProductSchema),
  controller.createProductHandler
);
router.put(
  '/:id',
  requirePermission('products:update'),
  uploadProductImage.any(),
  validateBody(updateProductSchema),
  controller.updateProductHandler
);
router.delete(
  '/:id',
  requirePermission('products:delete'),
  controller.deleteProductHandler
);

export default router;
