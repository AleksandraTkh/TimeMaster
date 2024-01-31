import pg from "pg";
const { Pool } = pg;

const pool = new Pool({
  user: "ntvhxaxq",
  host: "tyke.db.elephantsql.com",
  database: "ntvhxaxq",
  password: "nFQolhiPyGloqBgue3_a4jb0VsUF8H54",
  port: 5432,
});

export default pool;
