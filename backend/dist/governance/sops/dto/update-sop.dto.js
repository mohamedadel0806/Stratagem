"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSOPDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_sop_dto_1 = require("./create-sop.dto");
class UpdateSOPDto extends (0, swagger_1.PartialType)(create_sop_dto_1.CreateSOPDto) {
}
exports.UpdateSOPDto = UpdateSOPDto;
//# sourceMappingURL=update-sop.dto.js.map