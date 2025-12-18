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
var EmailDistributionListService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailDistributionListService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const email_distribution_list_entity_1 = require("../entities/email-distribution-list.entity");
const user_entity_1 = require("../../users/entities/user.entity");
let EmailDistributionListService = EmailDistributionListService_1 = class EmailDistributionListService {
    constructor(distributionListRepository, userRepository) {
        this.distributionListRepository = distributionListRepository;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(EmailDistributionListService_1.name);
    }
    async create(dto, userId) {
        const distributionList = this.distributionListRepository.create(Object.assign(Object.assign({}, dto), { createdById: userId }));
        if (dto.userIds && dto.userIds.length > 0) {
            const users = await this.userRepository.find({
                where: { id: (0, typeorm_2.In)(dto.userIds) },
            });
            distributionList.users = users;
        }
        return this.distributionListRepository.save(distributionList);
    }
    async findAll() {
        return this.distributionListRepository.find({
            relations: ['createdBy', 'users'],
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(id) {
        const distributionList = await this.distributionListRepository.findOne({
            where: { id },
            relations: ['createdBy', 'users'],
        });
        if (!distributionList) {
            throw new common_1.NotFoundException(`Email distribution list with ID ${id} not found`);
        }
        return distributionList;
    }
    async update(id, dto) {
        const distributionList = await this.findOne(id);
        Object.assign(distributionList, dto);
        return this.distributionListRepository.save(distributionList);
    }
    async delete(id) {
        const distributionList = await this.findOne(id);
        await this.distributionListRepository.remove(distributionList);
    }
    async sendReportEmail(emailAddresses, reportName, reportBuffer, format, filename) {
        this.logger.log(`Sending report "${reportName}" to ${emailAddresses.length} recipients`);
        this.logger.log(`Report format: ${format}, Filename: ${filename}`);
        this.logger.log(`Report buffer size: ${reportBuffer.length} bytes`);
    }
};
exports.EmailDistributionListService = EmailDistributionListService;
exports.EmailDistributionListService = EmailDistributionListService = EmailDistributionListService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(email_distribution_list_entity_1.EmailDistributionList)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], EmailDistributionListService);
//# sourceMappingURL=email-distribution-list.service.js.map