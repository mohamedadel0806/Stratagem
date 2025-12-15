"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBusinessApplicationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_business_application_dto_1 = require("./create-business-application.dto");
class UpdateBusinessApplicationDto extends (0, swagger_1.PartialType)(create_business_application_dto_1.CreateBusinessApplicationDto) {
}
exports.UpdateBusinessApplicationDto = UpdateBusinessApplicationDto;
//# sourceMappingURL=update-business-application.dto.js.map