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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessUnitService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const business_unit_entity_1 = require("../entities/business-unit.entity");
let BusinessUnitService = class BusinessUnitService {
    constructor(businessUnitRepository) {
        this.businessUnitRepository = businessUnitRepository;
    }
    async findAll() {
        return this.businessUnitRepository.find({
            where: { deletedAt: null },
            order: { name: 'ASC' },
        });
    }
    async findOne(id) {
        return this.businessUnitRepository.findOne({
            where: { id, deletedAt: null },
        });
    }
};
exports.BusinessUnitService = BusinessUnitService;
exports.BusinessUnitService = BusinessUnitService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(business_unit_entity_1.BusinessUnit)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BusinessUnitService);
//# sourceMappingURL=business-unit.service.js.map