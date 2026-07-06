import * as Sentry from '@sentry/node';
import { env } from '../config/env';
import { logger } from './logger';

const PII_REDACT_PATTERNS = [
  /\b\+8801[3-9]\d{8}\b/g,
  /\b8801[3-9]\d{8}\b/g,
  /\b01[3-9]\d{8}\b/g,
  /\b\d{10,17}\b/g,
  /[\w.+-]+@[\w-]+\.[\w.-]+/g,
];

export function redactPii(text: string): string {
  let out = text;
  for (const re of PII_REDACT_PATTERNS) out = out.replace(re, '[REDACTED]');
  return out;
}

let sentryReady = false;

export function initSentry(): void {
  if (!env.SENTRY_DSN) {
    logger.info('sentry_skipped_no_dsn');
    return;
  }

  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.1 : 0,
  });

  sentryReady = true;
  logger.info('sentry_initialized');
}

export function captureException(
  err: unknown,
  context?: Record<string, unknown>
): void {
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;
  const redactedMessage = redactPii(message);

  if (sentryReady) {
    if (err instanceof Error) {
      Sentry.captureException(err);
    } else {
      Sentry.captureException(new Error(redactedMessage));
    }
    return;
  }

  logger.error(
    { err: { message: redactedMessage, stack }, context },
    'captured_exception'
  );
}
