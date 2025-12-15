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
exports.ImportLog = exports.ImportFileType = exports.ImportStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
var ImportStatus;
(function (ImportStatus) {
    ImportStatus["PENDING"] = "pending";
    ImportStatus["PROCESSING"] = "processing";
    ImportStatus["COMPLETED"] = "completed";
    ImportStatus["FAILED"] = "failed";
    ImportStatus["PARTIAL"] = "partial";
})(ImportStatus || (exports.ImportStatus = ImportStatus = {}));
var ImportFileType;
(function (ImportFileType) {
    ImportFileType["CSV"] = "csv";
    ImportFileType["EXCEL"] = "excel";
})(ImportFileType || (exports.ImportFileType = ImportFileType = {}));
let ImportLog = class ImportLog {
};
exports.ImportLog = ImportLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ImportLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, name: 'fileName' }),
    __metadata("design:type", String)
], ImportLog.prototype, "fileName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ImportFileType,
        name: 'fileType',
    }),
    __metadata("design:type", String)
], ImportLog.prototype, "fileType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, name: 'assetType' }),
    __metadata("design:type", String)
], ImportLog.prototype, "assetType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: ImportStatus,
        default: ImportStatus.PENDING,
        name: 'status',
    }),
    __metadata("design:type", String)
], ImportLog.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'totalRecords' }),
    __metadata("design:type", Number)
], ImportLog.prototype, "totalRecords", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'successfulImports' }),
    __metadata("design:type", Number)
], ImportLog.prototype, "successfulImports", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0, name: 'failedImports' }),
    __metadata("design:type", Number)
], ImportLog.prototype, "failedImports", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true, name: 'errorReport' }),
    __metadata("design:type", String)
], ImportLog.prototype, "errorReport", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true, name: 'fieldMapping' }),
    __metadata("design:type", Object)
], ImportLog.prototype, "fieldMapping", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'importedById', nullable: false }),
    __metadata("design:type", String)
], ImportLog.prototype, "importedById", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: false }),
    (0, typeorm_1.JoinColumn)({ name: 'importedById' }),
    __metadata("design:type", user_entity_1.User)
], ImportLog.prototype, "importedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], ImportLog.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'createdAt' }),
    __metadata("design:type", Date)
], ImportLog.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true, name: 'completedAt' }),
    __metadata("design:type", Date)
], ImportLog.prototype, "completedAt", void 0);
exports.ImportLog = ImportLog = __decorate([
    (0, typeorm_1.Entity)('import_logs')
], ImportLog);
//# sourceMappingURL=import-log.entity.js.map