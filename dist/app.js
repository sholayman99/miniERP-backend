"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const pino_http_1 = __importDefault(require("pino-http"));
const env_1 = require("./config/env");
const logger_1 = require("./lib/logger");
const error_handler_1 = require("./middleware/error-handler");
const not_found_1 = require("./middleware/not-found");
const request_id_1 = require("./middleware/request-id");
const health_routes_1 = require("./modules/health/health.routes");
const routes_1 = __importDefault(require("./routes"));
function createApp() {
    const app = (0, express_1.default)();
    app.disable('x-powered-by');
    app.set('trust proxy', 1);
    app.use((0, helmet_1.default)());
    const allowedOrigins = [env_1.env.ADMIN_URL, 'http://localhost:5174'];
    app.use((0, cors_1.default)({
        origin: allowedOrigins,
        credentials: true,
    }));
    app.use((0, compression_1.default)());
    app.use(express_1.default.json({ limit: '1mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '1mb' }));
    app.use((0, cookie_parser_1.default)());
    app.use(request_id_1.requestId);
    app.use((0, pino_http_1.default)({
        logger: logger_1.logger,
        genReqId: (req) => req.id ?? 'unknown',
        customProps: (req) => ({ reqId: req.id }),
    }));
    app.use('/api/v1/health', health_routes_1.healthRouter);
    app.use('/api/v1', routes_1.default);
    app.use(not_found_1.notFoundHandler);
    app.use(error_handler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map