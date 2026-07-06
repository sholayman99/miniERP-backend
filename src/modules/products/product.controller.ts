import type { Request, Response } from 'express';
import { asyncHandler } from '../../lib/async-handler';
import { ok, created } from '../../lib/response';
import { BadRequestError } from '../../lib/errors';
import { checkLowStock } from '../inventory/low-stock.service';
import { uploadToCloudinary } from '../../lib/upload';
import * as productService from './product.service';

function getUploadedFiles(req: Request): Express.Multer.File[] {
  if (Array.isArray(req.files)) {
    return req.files;
  }

  const files: Express.Multer.File[] = [];
  const fileFields = req.files as
    | Record<string, Express.Multer.File[]>
    | undefined;

  if (fileFields) {
    for (const key of Object.keys(fileFields)) {
      const value = fileFields[key];
      if (Array.isArray(value)) files.push(...value);
    }
  }

  return files;
}

export const createProductHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const files = getUploadedFiles(req);
    if (files.length === 0)
      throw new BadRequestError('Product image is required');
    const imageUrls = await Promise.all(
      files.slice(0, 3).map((file) => uploadToCloudinary(file.buffer))
    );
    const product = await productService.createProduct(req.body, imageUrls);
    return created(res, product);
  }
);

export const listProductsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { items, meta } = await productService.listProducts(req.query);
    return ok(res, items, meta);
  }
);

export const getProductHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const product = await productService.getProductById(req.params.id);
    return ok(res, product);
  }
);

export const updateProductHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const files = getUploadedFiles(req);
    const imageUrls = files.length
      ? await Promise.all(
          files.slice(0, 3).map((file) => uploadToCloudinary(file.buffer))
        )
      : undefined;
    const product = await productService.updateProduct(
      req.params.id,
      req.body,
      imageUrls
    );
    checkLowStock(product); // manual stock edits can also cross the threshold
    return ok(res, product);
  }
);

export const deleteProductHandler = asyncHandler(
  async (req: Request, res: Response) => {
    await productService.deleteProduct(req.params.id);
    return ok(res, { deleted: true });
  }
);
