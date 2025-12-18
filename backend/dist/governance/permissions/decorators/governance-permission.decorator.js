"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireGovernancePermission = exports.PERMISSION_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.PERMISSION_KEY = 'governance_permission';
const RequireGovernancePermission = (module, action, resourceType) => (0, common_1.SetMetadata)(exports.PERMISSION_KEY, { module, action, resourceType });
exports.RequireGovernancePermission = RequireGovernancePermission;
//# sourceMappingURL=governance-permission.decorator.js.map