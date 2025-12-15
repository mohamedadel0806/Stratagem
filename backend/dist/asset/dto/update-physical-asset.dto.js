"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePhysicalAssetDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_physical_asset_dto_1 = require("./create-physical-asset.dto");
class UpdatePhysicalAssetDto extends (0, swagger_1.PartialType)(create_physical_asset_dto_1.CreatePhysicalAssetDto) {
}
exports.UpdatePhysicalAssetDto = UpdatePhysicalAssetDto;
//# sourceMappingURL=update-physical-asset.dto.js.map