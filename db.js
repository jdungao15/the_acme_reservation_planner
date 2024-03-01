const pg = require('pg');
const client = new pg.client(process.env.DATABASE_URL)  || 'localhost://'