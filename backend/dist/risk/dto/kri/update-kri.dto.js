"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateKRIDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_kri_dto_1 = require("./create-kri.dto");
class UpdateKRIDto extends (0, mapped_types_1.PartialType)(create_kri_dto_1.CreateKRIDto) {
}
exports.UpdateKRIDto = UpdateKRIDto;
//# sourceMappingURL=update-kri.dto.js.map