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
var AuditLogInterceptor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
const core_1 = require("@nestjs/core");
const audit_log_service_1 = require("../services/audit-log.service");
const audit_decorator_1 = require("../decorators/audit.decorator");
const audit_log_entity_1 = require("../entities/audit-log.entity");
let AuditLogInterceptor = AuditLogInterceptor_1 = class AuditLogInterceptor {
    constructor(auditLogService, reflector) {
        this.auditLogService = auditLogService;
        this.reflector = reflector;
        this.logger = new common_1.Logger(AuditLogInterceptor_1.name);
    }
    intercept(context, next) {
        const auditMetadata = this.reflector.get(audit_decorator_1.AUDIT_ACTION_KEY, context.getHandler());
        if (!auditMetadata) {
            return next.handle();
        }
        const request = context.switchToHttp().getRequest();
        const { user, body, params, query } = request;
        const { action, entityType, extractId, description } = auditMetadata;
        const startTime = Date.now();
        return next.handle().pipe((0, operators_1.tap)(async (response) => {
            try {
                let entityId = (params === null || params === void 0 ? void 0 : params.id) || (params === null || params === void 0 ? void 0 : params.entityId);
                if (extractId && typeof extractId === 'function') {
                    entityId = extractId(request);
                }
                else if (response === null || response === void 0 ? void 0 : response.id) {
                    entityId = response.id;
                }
                let changes = {};
                if (action === audit_log_entity_1.AuditAction.CREATE && body) {
                    changes = { created: body };
                }
                else if (action === audit_log_entity_1.AuditAction.UPDATE && body) {
                    changes = { updated: body };
                }
                await this.auditLogService.log({
                    userId: (user === null || user === void 0 ? void 0 : user.userId) || 'SYSTEM',
                    action,
                    entityType,
                    entityId: entityId || 'UNKNOWN',
                    description: description || `${action} ${entityType}`,
                    changes,
                    metadata: {
                        method: request.method,
                        path: request.path,
                        statusCode: 200,
                        duration: Date.now() - startTime,
                        query: query && Object.keys(query).length > 0 ? query : undefined,
                    },
                    ipAddress: this.getIpAddress(request),
                    userAgent: request.get('user-agent'),
                });
            }
            catch (error) {
                this.logger.error(`Failed to log audit entry: ${error.message}`, error.stack);
            }
        }), (0, operators_1.catchError)((error) => {
            this.logger.debug(`Audit error (${action} ${entityType}): ${error.message}`);
            throw error;
        }));
    }
    getIpAddress(request) {
        var _a, _b, _c, _d, _e;
        return (request.ip ||
            ((_a = request.connection) === null || _a === void 0 ? void 0 : _a.remoteAddress) ||
            ((_b = request.socket) === null || _b === void 0 ? void 0 : _b.remoteAddress) ||
            ((_e = (_d = (_c = request.headers) === null || _c === void 0 ? void 0 : _c['x-forwarded-for']) === null || _d === void 0 ? void 0 : _d.split(',')[0]) === null || _e === void 0 ? void 0 : _e.trim()) ||
            'UNKNOWN');
    }
};
exports.AuditLogInterceptor = AuditLogInterceptor;
exports.AuditLogInterceptor = AuditLogInterceptor = AuditLogInterceptor_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [audit_log_service_1.AuditLogService,
        core_1.Reflector])
], AuditLogInterceptor);
//# sourceMappingURL=audit-log.interceptor.js.map