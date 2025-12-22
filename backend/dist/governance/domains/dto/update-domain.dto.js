"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDomainDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_domain_dto_1 = require("./create-domain.dto");
class UpdateDomainDto extends (0, mapped_types_1.PartialType)(create_domain_dto_1.CreateDomainDto) {
}
exports.UpdateDomainDto = UpdateDomainDto;
//# sourceMappingURL=update-domain.dto.js.map