"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthController = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const response_1 = require("../../lib/response");
exports.healthController = {
    async shallow(_req, res) {
        return (0, response_1.ok)(res, { status: 'ok', timestamp: new Date().toISOString() });
    },
    async deep(_req, res) {
        const checks = {};
        let allOk = true;
        const tMongo = Date.now();
        try {
            const state = mongoose_1.default.connection.readyState;
            if (state !== 1)
                throw new Error(`mongo not connected (state=${state})`);
            const db = mongoose_1.default.connection.db;
            if (!db)
                throw new Error('mongo db handle missing');
            await db.admin().ping();
            checks.mongo = { ok: true, latencyMs: Date.now() - tMongo };
        }
        catch (err) {
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
//# sourceMappingURL=health.controller.js.map