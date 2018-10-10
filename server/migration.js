const { Pool } = require('pg');
const dotenv = require('dotenv');
// const randomId = require('uuid');
// const bcrypt = require('bcryptjs');

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
};

require('make-runnable');
