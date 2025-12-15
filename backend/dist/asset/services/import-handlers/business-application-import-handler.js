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
exports.BusinessApplicationImportHandler = void 0;
const common_1 = require("@nestjs/common");
const business_application_service_1 = require("../business-application.service");
const base_import_handler_1 = require("./base-import-handler");
let BusinessApplicationImportHandler = class BusinessApplicationImportHandler extends base_import_handler_1.BaseImportHandler {
    constructor(businessApplicationService) {
        super();
        this.businessApplicationService = businessApplicationService;
    }
    mapFields(row, mapping) {
        const assetData = {};
        for (const [csvColumn, assetField] of Object.entries(mapping)) {
            if (assetField && row[csvColumn] !== undefined && row[csvColumn] !== null && row[csvColumn] !== '') {
                const value = row[csvColumn];
                if (assetField === 'dataProcessed' || assetField === 'complianceRequirements') {
                    assetData[assetField] = this.parseArray(value);
                }
                else if (assetField === 'vendorContact') {
                    try {
                        if (typeof value === 'string' && value.startsWith('{')) {
                            assetData[assetField] = JSON.parse(value);
                        }
                        else {
                            const parts = value.split(/[|,]/).map((p) => p.trim());
                            if (parts.length >= 3) {
                                assetData[assetField] = {
                                    name: parts[0],
                                    email: parts[1],
                                    phone: parts[2],
                                };
                            }
                        }
                    }
                    catch (_a) {
                    }
                }
                else if (assetField === 'securityTestResults') {
                    try {
                        if (typeof value === 'string' && value.startsWith('{')) {
                            assetData[assetField] = JSON.parse(value);
                        }
                    }
                    catch (_b) {
                    }
                }
                else if (assetField === 'dataClassification') {
                    assetData[assetField] = this.normalizeEnumValue(value, {
                        'public': 'public',
                        'internal': 'internal',
                        'confidential': 'confidential',
                        'restricted': 'restricted',
                        'secret': 'secret',
                        'top_secret': 'top_secret',
                        'top secret': 'top_secret',
                    });
                }
                else if (assetField === 'criticalityLevel') {
                    assetData[assetField] = this.normalizeEnumValue(value, {
                        'critical': 'critical',
                        'high': 'high',
                        'medium': 'medium',
                        'low': 'low',
                    });
                }
                else if (assetField === 'licenseCount') {
                    assetData[assetField] = this.parseNumber(value);
                }
                else if (['licenseExpiry', 'lastSecurityTestDate'].includes(assetField)) {
                    assetData[assetField] = this.parseDate(value);
                }
                else {
                    assetData[assetField] = value;
                }
            }
        }
        return assetData;
    }
    validate(data) {
        const errors = [];
        if (!data.applicationName) {
            errors.push('Application name is required');
        }
        return errors;
    }
    async createAsset(data, userId) {
        return this.businessApplicationService.create(data, userId);
    }
};
exports.BusinessApplicationImportHandler = BusinessApplicationImportHandler;
exports.BusinessApplicationImportHandler = BusinessApplicationImportHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [business_application_service_1.BusinessApplicationService])
], BusinessApplicationImportHandler);
//# sourceMappingURL=business-application-import-handler.js.map