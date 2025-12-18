"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStandardDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_standard_dto_1 = require("./create-standard.dto");
class UpdateStandardDto extends (0, swagger_1.PartialType)(create_standard_dto_1.CreateStandardDto) {
}
exports.UpdateStandardDto = UpdateStandardDto;
//# sourceMappingURL=update-standard.dto.js.map