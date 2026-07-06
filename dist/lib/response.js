"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ok = ok;
exports.created = created;
exports.noContent = noContent;
exports.fail = fail;
function ok(res, data, meta) {
    return res.status(200).json({ ok: true, data, ...(meta ? { meta } : {}) });
}
function created(res, data) {
    return res.status(201).json({ ok: true, data });
}
function noContent(res) {
    return res.status(204).end();
}
function fail(res, status, code, message, details) {
    return res.status(status).json({
        ok: false,
        error: { code, message, ...(details ? { details } : {}) },
    });
}
//# sourceMappingURL=response.js.map