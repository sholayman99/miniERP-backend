"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestId = requestId;
const crypto_1 = __importDefault(require("crypto"));
const HEADER = 'x-request-id';
function requestId(req, res, next) {
    const incoming = req.headers[HEADER];
    const id = typeof incoming === 'string' && incoming.length <= 128 ? incoming : crypto_1.default.randomUUID();
    req.id = id;
    res.setHeader(HEADER, id);
    next();
}
//# sourceMappingURL=request-id.js.map