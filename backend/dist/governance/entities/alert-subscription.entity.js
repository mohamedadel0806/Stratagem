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
exports.AlertSubscription = exports.NotificationFrequency = exports.NotificationChannel = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const alert_entity_1 = require("./alert.entity");
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["IN_APP"] = "in_app";
    NotificationChannel["EMAIL"] = "email";
    NotificationChannel["SLACK"] = "slack";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
var NotificationFrequency;
(function (NotificationFrequency) {
    NotificationFrequency["IMMEDIATE"] = "immediate";
    NotificationFrequency["DAILY"] = "daily";
    NotificationFrequency["WEEKLY"] = "weekly";
})(NotificationFrequency || (exports.NotificationFrequency = NotificationFrequency = {}));
let AlertSubscription = class AlertSubscription {
};
exports.AlertSubscription = AlertSubscription;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AlertSubscription.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], AlertSubscription.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], AlertSubscription.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: alert_entity_1.AlertType, nullable: true }),
    __metadata("design:type", String)
], AlertSubscription.prototype, "alertType", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: alert_entity_1.AlertSeverity, nullable: true }),
    __metadata("design:type", String)
], AlertSubscription.prototype, "severity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array' }),
    __metadata("design:type", Array)
], AlertSubscription.prototype, "channels", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: NotificationFrequency, default: NotificationFrequency.IMMEDIATE }),
    __metadata("design:type", String)
], AlertSubscription.prototype, "frequency", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], AlertSubscription.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], AlertSubscription.prototype, "filters", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], AlertSubscription.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], AlertSubscription.prototype, "updatedAt", void 0);
exports.AlertSubscription = AlertSubscription = __decorate([
    (0, typeorm_1.Entity)('alert_subscriptions'),
    (0, typeorm_1.Unique)(['userId', 'alertType', 'severity'])
], AlertSubscription);
//# sourceMappingURL=alert-subscription.entity.js.map