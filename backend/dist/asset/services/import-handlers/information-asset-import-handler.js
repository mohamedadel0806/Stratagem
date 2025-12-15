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
exports.InformationAssetImportHandler = void 0;
const common_1 = require("@nestjs/common");
const information_asset_service_1 = require("../information-asset.service");
const base_import_handler_1 = require("./base-import-handler");
let InformationAssetImportHandler = class InformationAssetImportHandler extends base_import_handler_1.BaseImportHandler {
    constructor(informationAssetService) {
        super();
        this.informationAssetService = informationAssetService;
    }
    mapFields(row, mapping) {
        const assetData = {};
        for (const [csvColumn, assetField] of Object.entries(mapping)) {
            if (assetField && row[csvColumn] !== undefined && row[csvColumn] !== null && row[csvColumn] !== '') {
                const value = row[csvColumn];
                if (assetField === 'complianceRequirements') {
                    assetData[assetField] = this.parseArray(value);
                }
                else if (assetField === 'classificationLevel') {
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
                else if (['classificationDate', 'reclassificationDate'].includes(assetField)) {
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
        if (!data.name) {
            errors.push('Name is required');
        }
        if (!data.informationType) {
            errors.push('Information type is required');
        }
        if (!data.classificationLevel) {
            errors.push('Classification level is required');
        }
        return errors;
    }
    async createAsset(data, userId) {
        return this.informationAssetService.create(data, userId);
    }
};
exports.InformationAssetImportHandler = InformationAssetImportHandler;
exports.InformationAssetImportHandler = InformationAssetImportHandler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [information_asset_service_1.InformationAssetService])
], InformationAssetImportHandler);
//# sourceMappingURL=information-asset-import-handler.js.map