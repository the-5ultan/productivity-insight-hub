const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 3306;

console.log('\n=== Database Configuration ===');
console.log(`DB_HOST: ${DB_HOST}`);
console.log(`DB_PORT: ${DB_PORT}`);
console.log(`DB_NAME: ${DB_NAME}`);
console.log(`DB_USER: ${DB_USER}`);
console.log('=== End DB Config ===\n');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 60000,
    ssl: {
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 10,
    min: 2,
    acquire: 60000,
    idle: 10000,
    evict: 1000
  },
  retry: {
    match: [
      /SequelizeConnectionError/,
      /SequelizeConnectionRefusedError/,
      /SequelizeHostNotFoundError/,
      /SequelizeHostNotReachableError/,
      /SequelizeInvalidConnectionError/,
      /SequelizeConnectionTimedOutError/,
      /ETIMEDOUT/,
      /ECONNREFUSED/,
      /ENOTFOUND/,
      /ECONNRESET/,
      /PROTOCOL_CONNECTION_LOST/
    ],
    max: 3
  },
  logging: false
});

const testDirectConnection = async () => {
  console.log('\n--- Direct mysql2 Connection Test ---');
  console.log(`Connecting to ${DB_HOST}:${DB_PORT} as ${DB_USER}...`);
  const mysql = require('mysql2/promise');
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      connectTimeout: 30000,
      ssl: {
        rejectUnauthorized: false
      }
    });
    const [rows] = await connection.execute('SELECT 1 AS result');
    await connection.ping();
    console.log(`✓ Direct mysql2 connection successful. Test query: ${JSON.stringify(rows[0])}`);
    await connection.end();
    return true;
  } catch (err) {
    console.error('✗ Direct mysql2 connection failed:');
    console.error(`  Code: ${err.code}`);
    console.error(`  Message: ${err.message}`);
    if (err.code === 'ETIMEDOUT') {
      console.error('  → Connection timed out. Possible causes:');
      console.error(`    - Host "${DB_HOST}" is unreachable from this network`);
      console.error(`    - Port ${DB_PORT} is incorrect or blocked by a firewall`);
      console.error(`    - Railway proxy is not accepting connections`);
      console.error(`    - VPN or corporate proxy interfering with outbound connections`);
      console.error(`    - Try: Test-NetConnection ${DB_HOST} -Port ${DB_PORT}`);
    } else if (err.code === 'ENOTFOUND') {
      console.error(`  → DNS resolution failed for "${DB_HOST}". Check DB_HOST value.`);
    } else if (err.code === 'ECONNREFUSED') {
      console.error(`  → Connection refused on ${DB_HOST}:${DB_PORT}. Check port and firewall.`);
    } else if (err.code === 'ECONNRESET') {
      console.error('  → Connection reset. SSL/TLS handshake likely failed.');
      console.error('    - Try setting ssl.rejectUnauthorized to false in config/db.js');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('  → Access denied. Invalid username or password.');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error(`  → Database "${DB_NAME}" does not exist.`);
    }
    return false;
  }
};

module.exports = sequelize;
module.exports.testDirectConnection = testDirectConnection;
