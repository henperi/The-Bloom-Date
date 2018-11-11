'use strict';

var createAllTables = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return createUsersTable();

          case 2:
            _context.next = 4;
            return createProfilesTable();

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function createAllTables() {
    return _ref.apply(this, arguments);
  };
}();

var dropAllTables = function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return dropUsersTable();

          case 2:
            _context2.next = 4;
            return dropProfilesTable();

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function dropAllTables() {
    return _ref2.apply(this, arguments);
  };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var _require = require('pg'),
    Pool = _require.Pool;

var dotenv = require('dotenv');
var randomId = require('uuid');
var bcrypt = require('bcryptjs');
// const helper = require('./src/controllers/helper');

require('babel-polyfill');

dotenv.config();

var envType = process.env.ENV_TYPE;

var databaseURL = void 0;
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

var pool = new Pool({
  connectionString: databaseURL
});

pool.on('connect', function () {
  console.log('connected to the ' + envType + ' database', databaseURL);
});

/**
 * Create Tables
 */
var createUsersTable = function createUsersTable() {
  var queryText = 'CREATE TABLE IF NOT EXISTS\n      users(\n        id VARCHAR(128) PRIMARY KEY,\n        email VARCHAR(128) NOT NULL,\n        password VARCHAR(128) NOT NULL,\n        role TEXT NOT NULL,\n        created_at TIMESTAMP,\n        updated_at TIMESTAMP\n      )';

  pool.query(queryText).then(function (res) {
    console.log('res:', res);
    pool.end();
  }).catch(function (err) {
    console.log('err:', err);
    pool.end();
  });
};

var createProfilesTable = function createProfilesTable() {
  var queryText = 'CREATE TABLE IF NOT EXISTS\n      profiles(\n        user_id VARCHAR(128) PRIMARY KEY,\n        fullname VARCHAR(128),\n        gender VARCHAR(128),\n        birthday VARCHAR(128),\n        residence VARCHAR(128),\n        country VARCHAR(128),\n        state TEXT NOT NULL,\n        tribe TEXT NOT NULL,\n        heard_from TEXT NOT NULL,\n        created_at TIMESTAMP,\n        updated_at TIMESTAMP\n      )';

  pool.query(queryText).then(function (res) {
    console.log('res:', res);
    pool.end();
  }).catch(function (err) {
    console.log('err:', err);
    pool.end();
  });
};

var insertAdmin = function insertAdmin() {
  // const hashPassword = password => bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  // const password = hashPassword(process.env.ADMIN_PASSWORD);
  // const password = bcrypt.hashSync(process.env.ADMIN_PASSWORD, bcrypt.genSaltSync(8));
  // const hashPassword = helper.hashPassword(process.env.ADMIN_PASSWORD);

  var hashPassword = function hashPassword() {
    return bcrypt.hashSync(process.env.ADMIN_PASSWORD, bcrypt.genSaltSync(8));
  };
  var queryText = 'INSERT INTO users(id, email, \n    password, role, created_at, updated_at)\n    Values($1, $2, $3, $4, $5, $6)\n    returning *';
  var values = [randomId.v1(), process.env.ADMIN_EMAIL, hashPassword(), 'Admin', new Date(), new Date()];
  console.log(values);
  pool.query(queryText, values).then(function (res) {
    console.log('res:', res);
    pool.end();
  }).catch(function (err) {
    console.log('err:', err);
    pool.end();
  });
};
/**
 * Drop Tables
 */
var dropUsersTable = function dropUsersTable() {
  var queryText = 'DROP TABLE IF EXISTS users';
  pool.query(queryText).then(function (res) {
    console.log(res);
    pool.end();
  }).catch(function (err) {
    console.log(err);
    pool.end();
  });
};

var dropProfilesTable = function dropProfilesTable() {
  var queryText = 'DROP TABLE IF EXISTS profiles';
  pool.query(queryText).then(function (res) {
    console.log(res);
    pool.end();
  }).catch(function (err) {
    console.log(err);
    pool.end();
  });
};

pool.on('remove', function () {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createAllTables: createAllTables,
  createUsersTable: createUsersTable,
  createProfilesTable: createProfilesTable,
  dropAllTables: dropAllTables,
  dropUsersTable: dropUsersTable,
  dropProfilesTable: dropProfilesTable,
  insertAdmin: insertAdmin
};

require('make-runnable');