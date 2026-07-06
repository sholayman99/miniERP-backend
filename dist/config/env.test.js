"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
(0, vitest_1.describe)('env config', () => {
    const originalEnv = { ...process.env };
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.resetModules();
        process.env = { ...originalEnv };
        delete process.env.ADMIN_URL;
        delete process.env.MONGODB_URI;
        delete process.env.JWT_ACCESS_SECRET;
        delete process.env.CLOUDINARY_CLOUD_NAME;
        delete process.env.CLOUDINARY_API_KEY;
        delete process.env.CLOUDINARY_API_SECRET;
    });
    (0, vitest_1.afterEach)(() => {
        process.env = originalEnv;
        vitest_1.vi.restoreAllMocks();
    });
    (0, vitest_1.it)('falls back to development defaults when env vars are missing', async () => {
        const exitSpy = vitest_1.vi.spyOn(process, 'exit').mockImplementation(((code) => {
            throw new Error(`process.exit:${code}`);
        }));
        const { env } = await import('./env.js');
        (0, vitest_1.expect)(exitSpy).not.toHaveBeenCalled();
        (0, vitest_1.expect)(env.ADMIN_URL).toBe('http://localhost:3000');
        (0, vitest_1.expect)(env.MONGODB_URI).toBe('mongodb://127.0.0.1:27017/erp-management');
        (0, vitest_1.expect)(env.JWT_ACCESS_SECRET).toBe('dev-jwt-secret-change-me');
    });
});
//# sourceMappingURL=env.test.js.map