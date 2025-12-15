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
exports.PhysicalAssetImportHandler = void 0;
const common_1 = require("@nestjs/common");
const physical_asset_service_1 = require("../physical-asset.service");
const base_import_handler_1 = require("./base-import-handler");
let PhysicalAssetImportHandler = class PhysicalAssetImportHandler extends base_import_handler_1.BaseImportHandler {
    constructor(physicalAssetService) {
        super();
        this.physicalAssetService = physicalAssetService;
    }
    mapFields(row, mapping) {
        const assetData = {};
        for (const [csvColumn, assetField] of Object.entries(mapping)) {
            if (assetField && row[csvColumn] !== undefined && row[csvColumn] !== null && row[csvColumn] !== '') {
                const value = row[csvColumn];
                if (assetField === 'ipAddresses' || assetField === 'macAddresses' || assetField === 'complianceRequirements') {
                    assetData[assetField] = this.parseArray(value);
                }
                else if (assetField === 'installedSoftware') {
                    try {
                        assetData[assetField] = typeof value === 'string' ? JSON.parse(value) : value;
                    }
                    catch (_a) {
                        const items = this.parseArray(value);
                        assetData[assetField] = items.map(item => {
                            const parts = item.split('|');
                            return {
                                name: parts[0] || '',
                                version: parts[1] || '',
                                patch_level: parts[2] || '',
                            };
                        });
                    }
                }
                else if (assetField === 'activePortsServices') {
                    try {
                        assetData[assetField] = typeof value === 'string' ? JSON.parse(value) : value;
                    }
                    catch (_b) {
                        const items = this.parseArray(value);
                        assetData[assetField] = items.map(item => {
                            const parts = item.split('|');
                            return {
                                port: parseInt(parts[0]) || 0,
                                service: parts[1] || '',
                                protocol: parts[2] || '',
                            };
                        });
                    }
                }
                else if (assetField === 'securityTestResults') {
                    try {
                        assetData[assetField] = typeof value === 'string' ? JSON.parse(value) : value;
                    }
                    catch (_c) {
                        const parts = value.split('|');
                        assetData[assetField] = {
                            last_test_date: this.parseDate(parts[0]) || new Date().toISOString(),
                            findings: parts[1] || '',
                            severity: parts[2] || '',
                        };
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
                else if (assetField === 'connectivityStatus') {
                    assetData[assetField] = this.normalizeEnumValue(value, {
                        'connected': 'connected',
                        'disconnected': 'disconnected',
                        'unknown': 'unknown',
                    });
                }
                else if (assetField === 'networkApprovalStatus') {
                    assetData[assetField] = this.normalizeEnumValue(value, {
                        'approved': 'approved',
                        'pending': 'pending',
                        'rejected': 'rejected',
                        'not_required': 'not_required',
                        'not required': 'not_required',
                    });
                }
                else if (['purchaseDate', 'warrantyExpiry', 'lastConnectivityCheck'].includes(assetField)) {
                    assetData[assetField] = this.parseDate(value);
                }
                else if (assetField === 'location' || assetField === 'building' || assetField === 'floor' || assetField === 'room') {
                    if (!assetData.physicalLocation) {
                        assetData.physicalLocation = '';
                    }
                    const parts = [assetData.physicalLocation, value].filter(Boolean);
                    assetData.physicalLocation = parts.join(', ');
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
        if (!data.assetDescription) {
            errors.push('Asset description is required');
        }
        if (!data.uniqueIdentifier) {
            errors.push('Unique identifier is required');
        }
        return errors;
    }
    async createAsset(data, userId) {
        return this.physicalAssetService.create(data, userId);
    }
};
exports.PhysicalAssetImportHandler = PhysicalAssetImportHandler;
exports.PhysicalAssetImportHandler = PhysicalAssetImportHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [physical_asset_service_1.PhysicalAssetService])
], PhysicalAssetImportHandler);
//# sourceMappingURL=physical-asset-import-handler.js.map