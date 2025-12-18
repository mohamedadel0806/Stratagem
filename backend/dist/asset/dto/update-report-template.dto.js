"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReportTemplateDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_report_template_dto_1 = require("./create-report-template.dto");
class UpdateReportTemplateDto extends (0, mapped_types_1.PartialType)(create_report_template_dto_1.CreateReportTemplateDto) {
}
exports.UpdateReportTemplateDto = UpdateReportTemplateDto;
//# sourceMappingURL=update-report-template.dto.js.map