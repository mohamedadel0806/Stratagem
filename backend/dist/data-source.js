"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const parseDatabaseUrl = (url) => {
    if (!url)
        return null;
    try {
        const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
        if (match) {
            return {
                username: match[1],
                password: match[2],
                host: match[3],
                port: parseInt(match[4]),
                database: match[5],
            };
        }
    }
    catch (_a) {
    }
    return null;
};
const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || (dbConfig === null || dbConfig === void 0 ? void 0 : dbConfig.host) || 'postgres',
    port: parseInt(process.env.DB_PORT || String(dbConfig === null || dbConfig === void 0 ? void 0 : dbConfig.port) || '5432'),
    username: process.env.POSTGRES_USER || (dbConfig === null || dbConfig === void 0 ? void 0 : dbConfig.username) || 'postgres',
    password: process.env.POSTGRES_PASSWORD || (dbConfig === null || dbConfig === void 0 ? void 0 : dbConfig.password) || 'password',
    database: process.env.POSTGRES_DB || (dbConfig === null || dbConfig === void 0 ? void 0 : dbConfig.database) || 'grc_platform',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    synchronize: false,
});
//# sourceMappingURL=data-source.js.map