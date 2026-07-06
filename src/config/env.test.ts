import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('env config', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
    delete process.env.ADMIN_URL;
    delete process.env.MONGODB_URI;
    delete process.env.JWT_ACCESS_SECRET;
    delete process.env.CLOUDINARY_CLOUD_NAME;
    delete process.env.CLOUDINARY_API_KEY;
    delete process.env.CLOUDINARY_API_SECRET;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('falls back to development defaults when env vars are missing', async () => {
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(((
      code?: string | number
    ) => {
      throw new Error(`process.exit:${code}`);
    }) as never);

    const { env } = await import('./env.js');

    expect(exitSpy).not.toHaveBeenCalled();
    expect(env.ADMIN_URL).toBe('http://localhost:3000');
    expect(env.MONGODB_URI).toBe('mongodb://127.0.0.1:27017/erp-management');
    expect(env.JWT_ACCESS_SECRET).toBe('dev-jwt-secret-change-me');
  });
});
