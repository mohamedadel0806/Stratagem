"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseImportHandler = void 0;
class BaseImportHandler {
    parseBoolean(value) {
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'string') {
            const lower = value.toLowerCase().trim();
            return lower === 'true' || lower === 'yes' || lower === '1' || lower === 'y';
        }
        return Boolean(value);
    }
    parseDate(value) {
        if (!value)
            return undefined;
        try {
            const date = new Date(value);
            if (isNaN(date.getTime()))
                return undefined;
            return date.toISOString().split('T')[0];
        }
        catch (_a) {
            return undefined;
        }
    }
    parseArray(value) {
        if (Array.isArray(value))
            return value;
        if (typeof value === 'string') {
            return value.split(/[;,]/).map((v) => v.trim()).filter(Boolean);
        }
        return value ? [value] : [];
    }
    parseNumber(value) {
        if (typeof value === 'number')
            return value;
        if (typeof value === 'string') {
            const parsed = parseFloat(value);
            return isNaN(parsed) ? undefined : parsed;
        }
        return undefined;
    }
    normalizeEnumValue(value, mappings) {
        if (typeof value !== 'string')
            return value;
        const normalized = value.toLowerCase().trim().replace(/\s+/g, '_');
        return mappings[normalized] || normalized;
    }
}
exports.BaseImportHandler = BaseImportHandler;
//# sourceMappingURL=base-import-handler.js.map