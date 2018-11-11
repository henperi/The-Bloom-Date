const { Pool } = require('pg');
const dotenv = require('dotenv');
const randomId = require('uuid');
const bcrypt = require('bcryptjs');
// const helper = require('./src/controllers/helper');

require('babel-polyfill');

dotenv.config();

const envType = process.env.ENV_TYPE;

let databaseURL;
switch (envType) {
  case 'DEV':
    databaseURL = process.env.DEVELOPMENT_DATABASE_URL;
    break;

  case 'PROD':
    databaseURL = process.env.PRODUCTION_DATABASE_URL;
    break;

  default:
    databaseURL = process.env.DEVELOPMENT_DATABASE_URL;
    break;
}

const pool = new Pool({
  connectionString: databaseURL,
});

pool.on('connect', () => {
  console.log(`connected to the ${envType} database`, databaseURL);
});

/**
 * Create Tables
 */
const createUsersTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      users(
        id VARCHAR(128) PRIMARY KEY,
        email VARCHAR(128) NOT NULL,
        password VARCHAR(128) NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      )`;

  pool
    .query(queryText)
    .then((res) => {
      console.log('res:', res);
      pool.end();
    })
    .catch((err) => {
      console.log('err:', err);
      pool.end();
    });
};

const createProfilesTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
      profiles(
        user_id VARCHAR(128) PRIMARY KEY,
        fullname VARCHAR(128),
        gender VARCHAR(128),
        birthday VARCHAR(128),
        residence VARCHAR(128),
        country VARCHAR(128),
        state TEXT NOT NULL,
        tribe TEXT NOT NULL,
        heard_from TEXT NOT NULL,
        created_at TIMESTAMP,
        updated_at TIMESTAMP
      )`;

  pool
    .query(queryText)
    .then((res) => {
      console.log('res:', res);
      pool.end();
    })
    .catch((err) => {
      console.log('err:', err);
      pool.end();
    });
};

const insertAdmin = () => {
  // const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  // const password = hashPassword(process.env.ADMIN_PASSWORD);
  // const password = bcrypt.hashSync(process.env.ADMIN_PASSWORD, bcrypt.genSaltSync(8));
  // const hashPassword = helper.hashPassword(process.env.ADMIN_PASSWORD);

  const hashPassword = () => bcrypt.hashSync(process.env.ADMIN_PASSWORD, bcrypt.genSaltSync(8));
  const queryText = `INSERT INTO users(id, email, 
    password, role, created_at, updated_at)
    Values($1, $2, $3, $4, $5, $6)
    returning *`;
  const values = [
    randomId.v1(),
    process.env.ADMIN_EMAIL,
    hashPassword(),
    'Admin',
    new Date(),
    new Date(),
  ];
  console.log(values);
  pool
    .query(queryText, values)
    .then((res) => {
      console.log('res:', res);
      pool.end();
    })
    .catch((err) => {
      console.log('err:', err);
      pool.end();
    });
};
/**
 * Drop Tables
 */
const dropUsersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool
    .query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

const dropProfilesTable = () => {
  const queryText = 'DROP TABLE IF EXISTS profiles';
  pool
    .query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
};

async function createAllTables() {
  await createUsersTable();
  await createProfilesTable();
}

async function dropAllTables() {
  await dropUsersTable();
  await dropProfilesTable();
}

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createAllTables,
  createUsersTable,
  createProfilesTable,
  dropAllTables,
  dropUsersTable,
  dropProfilesTable,
  insertAdmin,
};

require('make-runnable');
