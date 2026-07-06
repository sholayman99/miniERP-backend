"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = notFoundHandler;
const response_1 = require("../lib/response");
function notFoundHandler(req, res) {
    return (0, response_1.fail)(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`);
}
//# sourceMappingURL=not-found.js.map