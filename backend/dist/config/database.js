"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const typeorm_naming_strategies_1 = require("typeorm-naming-strategies");
exports.databaseConfig = {
    type: 'postgres',
    host: process.env.DB_HOST || 'postgres',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    database: process.env.POSTGRES_DB ? String(process.env.POSTGRES_DB) : 'grc_platform',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
    namingStrategy: new typeorm_naming_strategies_1.SnakeNamingStrategy(),
};
//# sourceMappingURL=database.js.map