"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./lib/logger");
const mongo_1 = require("./lib/mongo");
const sentry_1 = require("./lib/sentry");
async function bootstrap() {
    (0, sentry_1.initSentry)();
    await (0, mongo_1.connectMongo)();
    const app = (0, app_1.createApp)();
    const server = app.listen(env_1.env.PORT, () => {
        logger_1.logger.info(`api_listening port=${env_1.env.PORT} env=${env_1.env.NODE_ENV}`);
    });
    const shutdown = async (signal) => {
        logger_1.logger.info(`shutdown_initiated signal=${signal}`);
        server.close(async () => {
            await (0, mongo_1.disconnectMongo)();
            logger_1.logger.info('shutdown_complete');
            process.exit(0);
        });
        setTimeout(() => {
            logger_1.logger.error('shutdown_forced');
            process.exit(1);
        }, 10_000);
    };
    process.on('SIGTERM', () => void shutdown('SIGTERM'));
    process.on('SIGINT', () => void shutdown('SIGINT'));
}
bootstrap().catch((err) => {
    (0, sentry_1.captureException)(err);
    logger_1.logger.fatal({ err }, 'bootstrap_failed');
    process.exit(1);
});
//# sourceMappingURL=server.js.map