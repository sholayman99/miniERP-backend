"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectMongo = connectMongo;
exports.disconnectMongo = disconnectMongo;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
const logger_1 = require("./logger");
mongoose_1.default.set('strictQuery', true);
async function connectMongo() {
    try {
        await mongoose_1.default.connect(env_1.env.MONGODB_URI, {
            maxPoolSize: 30,
            serverSelectionTimeoutMS: 10_000,
        });
        logger_1.logger.info('mongo_connected');
    }
    catch (err) {
        logger_1.logger.error({ err }, 'mongo_connect_failed');
        throw err;
    }
    mongoose_1.default.connection.on('disconnected', () => {
        logger_1.logger.warn('mongo_disconnected');
    });
    mongoose_1.default.connection.on('error', (err) => {
        logger_1.logger.error({ err }, 'mongo_connection_error');
    });
}
async function disconnectMongo() {
    await mongoose_1.default.disconnect();
    logger_1.logger.info('mongo_disconnected_clean');
}
//# sourceMappingURL=mongo.js.map