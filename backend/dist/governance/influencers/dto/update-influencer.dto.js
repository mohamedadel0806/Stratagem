"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInfluencerDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_influencer_dto_1 = require("./create-influencer.dto");
class UpdateInfluencerDto extends (0, mapped_types_1.PartialType)(create_influencer_dto_1.CreateInfluencerDto) {
}
exports.UpdateInfluencerDto = UpdateInfluencerDto;
//# sourceMappingURL=update-influencer.dto.js.map