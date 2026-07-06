import type { Request, Response, NextFunction } from 'express';
import { RateLimitError } from '../lib/errors';

export interface RateLimitOptions {
  windowSec: number;
  max: number;
  keyFn?: (req: Request) => string;
  scope: string;
}

interface Bucket {
  count: number;
  expiresAt: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(opts: RateLimitOptions) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const key = `rl:${opts.scope}:${opts.keyFn ? opts.keyFn(req) : (req.ip ?? 'unknown')}`;
    const now = Date.now();
    const existing = buckets.get(key);

    if (!existing || existing.expiresAt <= now) {
      buckets.set(key, { count: 1, expiresAt: now + opts.windowSec * 1000 });
      return next();
    }

    existing.count += 1;
    if (existing.count > opts.max) {
      const ttlSec = Math.max(1, Math.ceil((existing.expiresAt - now) / 1000));
      return next(new RateLimitError(ttlSec));
    }

    buckets.set(key, existing);
    next();
  };
}

export const rlByIp = (scope: string, max: number, windowSec: number) =>
  rateLimit({ scope, max, windowSec, keyFn: (req) => req.ip ?? 'unknown' });

export const rlByUser = (scope: string, max: number, windowSec: number) =>
  rateLimit({
    scope,
    max,
    windowSec,
    keyFn: (req) => req.auth?.userId ?? req.ip ?? 'unknown',
  });
