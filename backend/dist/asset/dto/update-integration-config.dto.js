"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIntegrationConfigDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_integration_config_dto_1 = require("./create-integration-config.dto");
class UpdateIntegrationConfigDto extends (0, mapped_types_1.PartialType)(create_integration_config_dto_1.CreateIntegrationConfigDto) {
}
exports.UpdateIntegrationConfigDto = UpdateIntegrationConfigDto;
//# sourceMappingURL=update-integration-config.dto.js.map