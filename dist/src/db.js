import knex from 'knex';
import config from '../knexfile.js';
const knexConfig = (config && config.default) ? config.default : config;
const db = knex(knexConfig.development);
export default db;
//# sourceMappingURL=db.js.map