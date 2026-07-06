"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rlByUser = exports.rlByIp = void 0;
exports.rateLimit = rateLimit;
const errors_1 = require("../lib/errors");
const buckets = new Map();
function rateLimit(opts) {
    return (req, _res, next) => {
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
            return next(new errors_1.RateLimitError(ttlSec));
        }
        buckets.set(key, existing);
        next();
    };
}
const rlByIp = (scope, max, windowSec) => rateLimit({ scope, max, windowSec, keyFn: (req) => req.ip ?? 'unknown' });
exports.rlByIp = rlByIp;
const rlByUser = (scope, max, windowSec) => rateLimit({
    scope,
    max,
    windowSec,
    keyFn: (req) => req.auth?.userId ?? req.ip ?? 'unknown',
});
exports.rlByUser = rlByUser;
//# sourceMappingURL=rate-limit.js.map