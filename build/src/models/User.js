'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _queryHelper = require('./queryHelper');

var _queryHelper2 = _interopRequireDefault(_queryHelper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function () {
  function User() {
    _classCallCheck(this, User);

    this.users = _queryHelper2.default;
  }

  /**
   * Find User By Email
   * @param {email} email
   * @returns {object} user object
   */


  _createClass(User, [{
    key: 'findByEmail',
    value: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res, email) {
        var queryText, _ref2, rows;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                queryText = 'SELECT * FROM users WHERE email = $1';
                _context.prev = 1;
                _context.next = 4;
                return this.users.query(queryText, [email]);

              case 4:
                _ref2 = _context.sent;
                rows = _ref2.rows;
                return _context.abrupt('return', rows[0]);

              case 9:
                _context.prev = 9;
                _context.t0 = _context['catch'](1);

                console.log(_context.t0);
                return _context.abrupt('return', res.status(500).json({
                  success: false,
                  errors: [{ msg: 'An error occured, while processing this request, try again in a moment' }]
                }));

              case 13:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 9]]);
      }));

      function findByEmail(_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      }

      return findByEmail;
    }()

    /**
     * Check if a user has inserted his profile
     * @param {userId} userId
     * @returns {object} user profile
     */

  }, {
    key: 'searchProfile',
    value: function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res, userId) {
        var queryText, _ref4, rows;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                queryText = 'SELECT * FROM profiles WHERE user_id = $1';
                _context2.prev = 1;
                _context2.next = 4;
                return this.users.query(queryText, [userId]);

              case 4:
                _ref4 = _context2.sent;
                rows = _ref4.rows;
                return _context2.abrupt('return', rows[0]);

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2['catch'](1);
                return _context2.abrupt('return', res.status(500).json({
                  success: false,
                  errors: [{ msg: 'An error occured, while processing this request, try again in a moment' }]
                }));

              case 12:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 9]]);
      }));

      function searchProfile(_x4, _x5, _x6) {
        return _ref3.apply(this, arguments);
      }

      return searchProfile;
    }()

    /**
     * Check if a user has inserted his profile
     * @param {userId} userId
     * @returns {object} user profile
     */

  }, {
    key: 'fetchAllProfiles',
    value: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
        var queryText, _ref6, rows;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                queryText = 'SELECT * FROM profiles';
                _context3.prev = 1;
                _context3.next = 4;
                return this.users.query(queryText);

              case 4:
                _ref6 = _context3.sent;
                rows = _ref6.rows;
                return _context3.abrupt('return', rows);

              case 9:
                _context3.prev = 9;
                _context3.t0 = _context3['catch'](1);
                return _context3.abrupt('return', res.status(500).json({
                  success: false,
                  errors: [{ msg: 'An error occured, while processing this request, try again in a moment' }]
                }));

              case 12:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this, [[1, 9]]);
      }));

      function fetchAllProfiles(_x7, _x8) {
        return _ref5.apply(this, arguments);
      }

      return fetchAllProfiles;
    }()

    /**
     * Create user account
     * @param {*} data
     * @returns {object} user ubject
     */

  }, {
    key: 'createUser',
    value: function () {
      var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res, data) {
        var queryText, values, _ref8, rows, response;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                // console.log('DATA::', data);
                queryText = 'INSERT INTO users(id, email, \n      password, role, created_at, updated_at)\n      Values($1, $2, $3, $4, $5, $6)\n      returning *';
                values = [_uuid2.default.v1(), data.email, data.hashPassword, data.role, new Date(), new Date()];
                _context4.prev = 2;
                _context4.next = 5;
                return this.users.query(queryText, values);

              case 5:
                _ref8 = _context4.sent;
                rows = _ref8.rows;
                response = { success: true, rows: rows[0] };
                return _context4.abrupt('return', response);

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4['catch'](2);
                return _context4.abrupt('return', res.status(500).json({
                  success: false,
                  errors: [{ msg: 'An error occured' }]
                }));

              case 14:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this, [[2, 11]]);
      }));

      function createUser(_x9, _x10, _x11) {
        return _ref7.apply(this, arguments);
      }

      return createUser;
    }()

    /**
     * Create/Insert the user profile account
     * @param {*} data
     * @returns {object} user ubject
     */

  }, {
    key: 'insertUserProfile',
    value: function () {
      var _ref9 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res, data) {
        var queryText, values, _ref10, rows, response;

        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                console.log('DARA', data);
                queryText = 'INSERT INTO profiles(user_id, fullname, \n      gender, birthday, residence, country, state, tribe, heard_from, created_at, updated_at)\n      Values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)\n      returning *';
                values = [data.userId, data.fullname, data.gender, data.birthday, data.residence, data.country, data.state, data.tribe, data.heardFrom, new Date(), new Date()];
                _context5.prev = 3;
                _context5.next = 6;
                return this.users.query(queryText, values);

              case 6:
                _ref10 = _context5.sent;
                rows = _ref10.rows;
                response = { success: true, rows: rows[0] };
                return _context5.abrupt('return', response);

              case 12:
                _context5.prev = 12;
                _context5.t0 = _context5['catch'](3);

                console.log(_context5.t0);
                return _context5.abrupt('return', res.status(500).json({
                  success: false,
                  errors: [{ msg: 'An error occured try again' }]
                }));

              case 16:
              case 'end':
                return _context5.stop();
            }
          }
        }, _callee5, this, [[3, 12]]);
      }));

      function insertUserProfile(_x12, _x13, _x14) {
        return _ref9.apply(this, arguments);
      }

      return insertUserProfile;
    }()
  }]);

  return User;
}();

exports.default = new User();