import knex from 'knex';
import config from '../knexfile.js';

const knexConfig = (config && (config as any).default) ? (config as any).default : config;
const db = knex(knexConfig.development);

export default db;
