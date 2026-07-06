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
const express_1 = require("express");
const require_auth_1 = require("../../middleware/require-auth");
const require_permission_1 = require("../../middleware/require-permission");
const validate_1 = require("../../middleware/validate");
const user_validation_1 = require("./user.validation");
const controller = __importStar(require("./user.controller"));
const router = (0, express_1.Router)();
router.use((0, require_auth_1.requireAuth)());
router.use((0, require_permission_1.requirePermission)('users:manage'));
router.get('/', controller.listUsersHandler);
router.post('/', (0, validate_1.validateBody)(user_validation_1.createUserSchema), controller.createUserHandler);
router.patch('/:id/active', (0, validate_1.validateBody)(user_validation_1.setUserActiveSchema), controller.setUserActiveHandler);
exports.default = router;
//# sourceMappingURL=user.routes.js.map