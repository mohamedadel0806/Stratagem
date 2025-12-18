"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateValidationRuleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_validation_rule_dto_1 = require("./create-validation-rule.dto");
class UpdateValidationRuleDto extends (0, mapped_types_1.PartialType)(create_validation_rule_dto_1.CreateValidationRuleDto) {
}
exports.UpdateValidationRuleDto = UpdateValidationRuleDto;
//# sourceMappingURL=update-validation-rule.dto.js.map