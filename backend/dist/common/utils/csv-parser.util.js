"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCSVRequirements = parseCSVRequirements;
const { parse } = require('csv-parse/sync');
const compliance_requirement_entity_1 = require("../entities/compliance-requirement.entity");
function parseCSVRequirements(csvContent) {
    try {
        const cleanContent = csvContent.replace(/^\uFEFF/, '');
        const records = parse(cleanContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            bom: true,
            cast: (value) => {
                if (typeof value === 'string') {
                    return value.trim();
                }
                return value;
            },
        });
        if (!records || records.length === 0) {
            throw new Error('No records found in CSV');
        }
        return records.map((row) => {
            const title = row['Requirement Title'] ||
                row['requirement title'] ||
                row.title ||
                row.Title ||
                '';
            const requirementCode = row['Requirement ID'] ||
                row['requirement id'] ||
                row.requirementCode ||
                row.code ||
                row.Code ||
                row['Requirement Code'] ||
                undefined;
            const description = row.Description ||
                row.description ||
                row['Requirement Description'] ||
                undefined;
            const category = row.Category ||
                row.category ||
                undefined;
            const complianceDeadline = row['Compliance Deadline'] ||
                row['compliance deadline'] ||
                undefined;
            const applicability = row.Applicability ||
                row.applicability ||
                undefined;
            const requirement = {
                title: title,
                description: description,
                requirementCode: requirementCode,
                category: category,
                complianceDeadline: complianceDeadline,
                applicability: applicability,
                status: mapStatusToEnum(row.status || row.Status || row['Status'] || 'not_started'),
            };
            return requirement;
        }).filter((req) => req.title && req.title.length > 0);
    }
    catch (error) {
        throw new Error(`Failed to parse CSV: ${error.message}`);
    }
}
function mapStatusToEnum(status) {
    const normalized = status.toLowerCase().trim();
    switch (normalized) {
        case 'compliant':
            return compliance_requirement_entity_1.RequirementStatus.COMPLIANT;
        case 'in_progress':
        case 'in progress':
        case 'inprogress':
            return compliance_requirement_entity_1.RequirementStatus.IN_PROGRESS;
        case 'partially_compliant':
        case 'partially compliant':
        case 'partiallycompliant':
            return compliance_requirement_entity_1.RequirementStatus.PARTIALLY_COMPLIANT;
        case 'non_compliant':
        case 'non compliant':
        case 'noncompliant':
            return compliance_requirement_entity_1.RequirementStatus.NON_COMPLIANT;
        case 'not_started':
        case 'not started':
        case 'notstarted':
        default:
            return compliance_requirement_entity_1.RequirementStatus.NOT_STARTED;
    }
}
//# sourceMappingURL=csv-parser.util.js.map