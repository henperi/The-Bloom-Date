'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

var _helper = require('./helper');

var _helper2 = _interopRequireDefault(_helper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var usersController = {
  signupStepOne: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
      var email, password, role, errors, msg, findUser, hashPassword, newUser, createUser, userToken;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              email = req.body.email.toLowerCase();
              password = req.body.password;
              role = 'User';
              errors = [];
              msg = void 0;


              if (password.length < 8) {
                msg = { msg: 'Your Password must be at least 8 characters' };
                errors.push(msg);
              }

              if (!(errors.length > 0)) {
                _context.next = 8;
                break;
              }

              return _context.abrupt('return', res.status(400).json({
                success: false,
                errors: errors
              }));

            case 8:
              _context.next = 10;
              return _User2.default.findByEmail(req, res, email);

            case 10:
              findUser = _context.sent;

              if (!findUser) {
                _context.next = 15;
                break;
              }

              msg = { msg: 'This email has already been taken' };
              errors.push(msg);

              return _context.abrupt('return', res.status(409).json({
                success: false,
                errors: errors
              }));

            case 15:
              hashPassword = _helper2.default.hashPassword(password);
              newUser = {
                email: email,
                hashPassword: hashPassword,
                role: role
              };
              _context.next = 19;
              return _User2.default.createUser(req, res, newUser);

            case 19:
              createUser = _context.sent;

              if (!createUser.success) {
                _context.next = 24;
                break;
              }

              userToken = _helper2.default.generateToken(createUser.rows.id, createUser.rows.email);

              console.log(createUser.rows);
              return _context.abrupt('return', res.status(201).json({
                success: true,
                success_msg: 'Account creation was successful, complete your profile',
                userToken: userToken,
                role: createUser.rows.role
              }));

            case 24:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, this);
    }));

    function signupStepOne(_x, _x2) {
      return _ref.apply(this, arguments);
    }

    return signupStepOne;
  }(),
  signupStepTwo: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
      var userId, gender, insertProfile;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              userId = req.user.userId;
              gender = req.body.gender;


              if (Number(gender) === 1) {
                gender = 'Male';
              } else {
                gender = 'Female';
              }

              req.body.userId = userId;
              req.body.gender = gender;

              _context2.next = 7;
              return _User2.default.insertUserProfile(req, res, req.body);

            case 7:
              insertProfile = _context2.sent;

              if (!insertProfile.success) {
                _context2.next = 10;
                break;
              }

              return _context2.abrupt('return', res.status(201).json({
                success: true,
                success_msg: 'Your profile has been successfully set up, redirecting to home page',
                data: insertProfile.rows
              }));

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function signupStepTwo(_x3, _x4) {
      return _ref2.apply(this, arguments);
    }

    return signupStepTwo;
  }(),
  signin: function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
      var email, password, findUser, checkPassword, userToken;
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              email = req.body.email.toLowerCase();
              password = req.body.password;
              _context3.next = 4;
              return _User2.default.findByEmail(req, res, email);

            case 4:
              findUser = _context3.sent;

              if (findUser) {
                _context3.next = 7;
                break;
              }

              return _context3.abrupt('return', res.status(404).json({
                success: false,
                errors: [{ msg: 'Your email does not exist' }]
              }));

            case 7:
              checkPassword = _helper2.default.comparePassword(findUser.password, password);

              if (checkPassword) {
                _context3.next = 10;
                break;
              }

              return _context3.abrupt('return', res.status(404).json({
                success: false,
                errors: [{ msg: 'Your password is wrong' }]
              }));

            case 10:
              userToken = _helper2.default.generateToken(findUser.id, findUser.email);
              return _context3.abrupt('return', res.status(200).json({
                success: true,
                success_msg: 'Your signin was successful',
                userToken: userToken,
                role: findUser.role
              }));

            case 12:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function signin(_x5, _x6) {
      return _ref3.apply(this, arguments);
    }

    return signin;
  }(),
  fetchProfile: function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(req, res) {
      var userId, fetchProfile;
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              userId = req.user.userId;
              _context4.next = 3;
              return _User2.default.searchProfile(req, res, userId);

            case 3:
              fetchProfile = _context4.sent;

              if (!fetchProfile) {
                _context4.next = 6;
                break;
              }

              return _context4.abrupt('return', res.status(200).json({
                success: true,
                success_msg: 'Your profile has been fetched',
                data: fetchProfile
              }));

            case 6:
              return _context4.abrupt('return', res.status(404).json({
                success: false,
                success_msg: 'You have not set up your profile'
              }));

            case 7:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, this);
    }));

    function fetchProfile(_x7, _x8) {
      return _ref4.apply(this, arguments);
    }

    return fetchProfile;
  }(),
  fetchAllProfiles: function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(req, res) {
      var fetchAllProfiles;
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _User2.default.fetchAllProfiles(req, res);

            case 2:
              fetchAllProfiles = _context5.sent;

              if (!fetchAllProfiles) {
                _context5.next = 5;
                break;
              }

              return _context5.abrupt('return', res.status(200).json({
                success: true,
                success_msg: 'Profiles have been fetched',
                data: fetchAllProfiles
              }));

            case 5:
              return _context5.abrupt('return', res.status(404).json({
                success: false,
                success_msg: 'No profiles found'
              }));

            case 6:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, this);
    }));

    function fetchAllProfiles(_x9, _x10) {
      return _ref5.apply(this, arguments);
    }

    return fetchAllProfiles;
  }()
};

exports.default = usersController;