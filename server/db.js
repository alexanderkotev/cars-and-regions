const Pool = require("pg").Pool;

const connectionString = "postgres://cxinrjgc:qDhwgASWvkU99eYKVlIfGXAiLkEuBsEc@abul.db.elephantsql.com/cxinrjgc";
const pool = new Pool({
  connectionString,
});

module.exports = pool;

// Pool configuration for my local db (Before implementing ElephantSQL)

// const pool = new Pool({
//     user: 'postgres',
//     password: 'admin',
//     host: 'localhost',
//     port: 5432,
//     database: 'cars_and_regions'
// });

// module.exports = pool;