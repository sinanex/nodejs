const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgresql://postgres:KXMuVeOvzCPXggEapYQennsZNjIFoCWf@maglev.proxy.rlwy.net:41678/railway",
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()

module.exports = pool;
