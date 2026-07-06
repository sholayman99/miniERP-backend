import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import { ok } from '../../lib/response';

export const healthController = {
  async shallow(_req: Request, res: Response) {
    return ok(res, { status: 'ok', timestamp: new Date().toISOString() });
  },

  async deep(_req: Request, res: Response) {
    const checks: Record<
      string,
      { ok: boolean; latencyMs?: number; error?: string }
    > = {};
    let allOk = true;

    const tMongo = Date.now();
    try {
      const state = mongoose.connection.readyState;
      if (state !== 1) throw new Error(`mongo not connected (state=${state})`);
      const db = mongoose.connection.db;
      if (!db) throw new Error('mongo db handle missing');
      await db.admin().ping();
      checks.mongo = { ok: true, latencyMs: Date.now() - tMongo };
    } catch (err) {
      allOk = false;
      checks.mongo = {
        ok: false,
        error: err instanceof Error ? err.message : 'unknown',
      };
    }

    return res.status(allOk ? 200 : 503).json({
      ok: allOk,
      status: allOk ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      checks,
    });
  },
};
