"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePolicyDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_policy_dto_1 = require("./create-policy.dto");
class UpdatePolicyDto extends (0, mapped_types_1.PartialType)(create_policy_dto_1.CreatePolicyDto) {
}
exports.UpdatePolicyDto = UpdatePolicyDto;
//# sourceMappingURL=update-policy.dto.js.map