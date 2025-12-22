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
exports.AlertLog = exports.AlertLogAction = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const alert_entity_1 = require("./alert.entity");
var AlertLogAction;
(function (AlertLogAction) {
    AlertLogAction["CREATED"] = "created";
    AlertLogAction["ACKNOWLEDGED"] = "acknowledged";
    AlertLogAction["RESOLVED"] = "resolved";
    AlertLogAction["DISMISSED"] = "dismissed";
    AlertLogAction["ESCALATED"] = "escalated";
    AlertLogAction["NOTIFIED"] = "notified";
})(AlertLogAction || (exports.AlertLogAction = AlertLogAction = {}));
let AlertLog = class AlertLog {
};
exports.AlertLog = AlertLog;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AlertLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AlertLog.prototype, "alertId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => alert_entity_1.Alert),
    (0, typeorm_1.JoinColumn)({ name: 'alert_id' }),
    __metadata("design:type", alert_entity_1.Alert)
], AlertLog.prototype, "alert", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: AlertLogAction }),
    __metadata("design:type", String)
], AlertLog.prototype, "action", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], AlertLog.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], AlertLog.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], AlertLog.prototype, "details", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AlertLog.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AlertLog.prototype, "createdAt", void 0);
exports.AlertLog = AlertLog = __decorate([
    (0, typeorm_1.Entity)('alert_logs')
], AlertLog);
//# sourceMappingURL=alert-log.entity.js.map