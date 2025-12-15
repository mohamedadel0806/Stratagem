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
exports.SupplierImportHandler = void 0;
const common_1 = require("@nestjs/common");
const supplier_service_1 = require("../supplier.service");
const base_import_handler_1 = require("./base-import-handler");
let SupplierImportHandler = class SupplierImportHandler extends base_import_handler_1.BaseImportHandler {
    constructor(supplierService) {
        super();
        this.supplierService = supplierService;
    }
    mapFields(row, mapping) {
        const assetData = {};
        for (const [csvColumn, assetField] of Object.entries(mapping)) {
            if (assetField && row[csvColumn] !== undefined && row[csvColumn] !== null && row[csvColumn] !== '') {
                const value = row[csvColumn];
                if (assetField === 'goodsServicesType' || assetField === 'complianceCertifications') {
                    assetData[assetField] = this.parseArray(value);
                }
                else if (assetField === 'primaryContact' || assetField === 'secondaryContact') {
                    try {
                        if (typeof value === 'string' && value.startsWith('{')) {
                            assetData[assetField] = JSON.parse(value);
                        }
                        else {
                            const parts = value.split(/[|,]/).map((p) => p.trim());
                            if (parts.length >= 4) {
                                assetData[assetField] = {
                                    name: parts[0],
                                    title: parts[1],
                                    email: parts[2],
                                    phone: parts[3],
                                };
                            }
                            else if (parts.length >= 3) {
                                assetData[assetField] = {
                                    name: parts[0],
                                    title: '',
                                    email: parts[1],
                                    phone: parts[2],
                                };
                            }
                        }
                    }
                    catch (_a) {
                    }
                }
                else if (assetField === 'criticalityLevel') {
                    assetData[assetField] = this.normalizeEnumValue(value, {
                        'critical': 'critical',
                        'high': 'high',
                        'medium': 'medium',
                        'low': 'low',
                    });
                }
                else if (assetField === 'autoRenewal' || assetField === 'insuranceVerified') {
                    assetData[assetField] = this.parseBoolean(value);
                }
                else if (assetField === 'contractValue' || assetField === 'performanceRating') {
                    assetData[assetField] = this.parseNumber(value);
                }
                else if (['contractStartDate', 'contractEndDate', 'riskAssessmentDate', 'backgroundCheckDate', 'lastReviewDate'].includes(assetField)) {
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
        if (!data.supplierName) {
            errors.push('Supplier name is required');
        }
        if (!data.uniqueIdentifier) {
            errors.push('Unique identifier is required');
        }
        return errors;
    }
    async createAsset(data, userId) {
        return this.supplierService.create(data, userId);
    }
};
exports.SupplierImportHandler = SupplierImportHandler;
exports.SupplierImportHandler = SupplierImportHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [supplier_service_1.SupplierService])
], SupplierImportHandler);
//# sourceMappingURL=supplier-import-handler.js.map