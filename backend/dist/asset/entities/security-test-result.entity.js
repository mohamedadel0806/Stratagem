"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SecurityTestResult = exports.SeverityLevel = exports.TestStatus = exports.TestType = void 0;
const typeorm_1 = require("typeorm");
const business_application_entity_1 = require("./business-application.entity");
const software_asset_entity_1 = require("./software-asset.entity");
const user_entity_1 = require("../../users/entities/user.entity");
var TestType;
(function (TestType) {
    TestType["PENETRATION_TEST"] = "penetration_test";
    TestType["VULNERABILITY_SCAN"] = "vulnerability_scan";
    TestType["CODE_REVIEW"] = "code_review";
    TestType["COMPLIANCE_AUDIT"] = "compliance_audit";
    TestType["SECURITY_ASSESSMENT"] = "security_assessment";
    TestType["OTHER"] = "other";
})(TestType || (exports.TestType = TestType = {}));
var TestStatus;
(function (TestStatus) {
    TestStatus["SCHEDULED"] = "scheduled";
    TestStatus["IN_PROGRESS"] = "in_progress";
    TestStatus["COMPLETED"] = "completed";
    TestStatus["FAILED"] = "failed";
    TestStatus["CANCELLED"] = "cancelled";
})(TestStatus || (exports.TestStatus = TestStatus = {}));
var SeverityLevel;
(function (SeverityLevel) {
    SeverityLevel["CRITICAL"] = "critical";
    SeverityLevel["HIGH"] = "high";
    SeverityLevel["MEDIUM"] = "medium";
    SeverityLevel["LOW"] = "low";
    SeverityLevel["INFO"] = "info";
    SeverityLevel["PASSED"] = "passed";
})(SeverityLevel || (exports.SeverityLevel = SeverityLevel = {}));
let SecurityTestResult = class SecurityTestResult {
};
exports.SecurityTestResult = SecurityTestResult;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ['application', 'software'],
        name: 'asset_type',
    }),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'asset_id' }),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => business_application_entity_1.BusinessApplication, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id', referencedColumnName: 'id' }),
    __metadata("design:type", business_application_entity_1.BusinessApplication)
], SecurityTestResult.prototype, "application", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => software_asset_entity_1.SoftwareAsset, { nullable: true, onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'asset_id', referencedColumnName: 'id' }),
    __metadata("design:type", software_asset_entity_1.SoftwareAsset)
], SecurityTestResult.prototype, "software", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TestType,
        name: 'test_type',
    }),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "testType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', name: 'test_date' }),
    __metadata("design:type", Date)
], SecurityTestResult.prototype, "testDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TestStatus,
        default: TestStatus.COMPLETED,
    }),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true, name: 'tester_name' }),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "testerName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 200, nullable: true, name: 'tester_company' }),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "testerCompany", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'findings_critical' }),
    __metadata("design:type", Number)
], SecurityTestResult.prototype, "findingsCritical", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'findings_high' }),
    __metadata("design:type", Number)
], SecurityTestResult.prototype, "findingsHigh", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'findings_medium' }),
    __metadata("design:type", Number)
], SecurityTestResult.prototype, "findingsMedium", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'findings_low' }),
    __metadata("design:type", Number)
], SecurityTestResult.prototype, "findingsLow", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'findings_info' }),
    __metadata("design:type", Number)
], SecurityTestResult.prototype, "findingsInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: SeverityLevel,
        nullable: true,
    }),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, nullable: true, name: 'overall_score' }),
    __metadata("design:type", Number)
], SecurityTestResult.prototype, "overallScore", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], SecurityTestResult.prototype, "passed", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'summary' }),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "summary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'findings' }),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "findings", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'recommendations' }),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "recommendations", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'report_file_id' }),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "reportFileId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'report_url' }),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "reportUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'remediation_due_date' }),
    __metadata("design:type", Date)
], SecurityTestResult.prototype, "remediationDueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'remediation_completed' }),
    __metadata("design:type", Boolean)
], SecurityTestResult.prototype, "remediationCompleted", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false, name: 'retest_required' }),
    __metadata("design:type", Boolean)
], SecurityTestResult.prototype, "retestRequired", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, name: 'retest_date' }),
    __metadata("design:type", Date)
], SecurityTestResult.prototype, "retestDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true, name: 'created_by' }),
    __metadata("design:type", String)
], SecurityTestResult.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], SecurityTestResult.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SecurityTestResult.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SecurityTestResult.prototype, "updatedAt", void 0);
exports.SecurityTestResult = SecurityTestResult = __decorate([
    (0, typeorm_1.Entity)('security_test_results'),
    (0, typeorm_1.Index)(['assetType', 'assetId']),
    (0, typeorm_1.Index)(['testDate']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['severity'])
], SecurityTestResult);
//# sourceMappingURL=security-test-result.entity.js.map