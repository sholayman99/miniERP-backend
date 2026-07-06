"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.redactPii = redactPii;
exports.initSentry = initSentry;
exports.captureException = captureException;
const Sentry = __importStar(require("@sentry/node"));
const env_1 = require("../config/env");
const logger_1 = require("./logger");
const PII_REDACT_PATTERNS = [
    /\b\+8801[3-9]\d{8}\b/g,
    /\b8801[3-9]\d{8}\b/g,
    /\b01[3-9]\d{8}\b/g,
    /\b\d{10,17}\b/g,
    /[\w.+-]+@[\w-]+\.[\w.-]+/g,
];
function redactPii(text) {
    let out = text;
    for (const re of PII_REDACT_PATTERNS)
        out = out.replace(re, '[REDACTED]');
    return out;
}
let sentryReady = false;
function initSentry() {
    if (!env_1.env.SENTRY_DSN) {
        logger_1.logger.info('sentry_skipped_no_dsn');
        return;
    }
    Sentry.init({
        dsn: env_1.env.SENTRY_DSN,
        environment: env_1.env.NODE_ENV,
        tracesSampleRate: env_1.env.NODE_ENV === 'production' ? 0.1 : 0,
    });
    sentryReady = true;
    logger_1.logger.info('sentry_initialized');
}
function captureException(err, context) {
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    const redactedMessage = redactPii(message);
    if (sentryReady) {
        if (err instanceof Error) {
            Sentry.captureException(err);
        }
        else {
            Sentry.captureException(new Error(redactedMessage));
        }
        return;
    }
    logger_1.logger.error({ err: { message: redactedMessage, stack }, context }, 'captured_exception');
}
//# sourceMappingURL=sentry.js.map