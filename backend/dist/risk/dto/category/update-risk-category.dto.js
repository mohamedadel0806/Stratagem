"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRiskCategoryDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_risk_category_dto_1 = require("./create-risk-category.dto");
class UpdateRiskCategoryDto extends (0, mapped_types_1.PartialType)(create_risk_category_dto_1.CreateRiskCategoryDto) {
}
exports.UpdateRiskCategoryDto = UpdateRiskCategoryDto;
//# sourceMappingURL=update-risk-category.dto.js.map