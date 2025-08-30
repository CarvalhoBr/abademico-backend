import knex, { Knex } from 'knex';

const knexConfig = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const config = knexConfig[environment] as Knex.Config;

const db = knex(config);

export default db;
