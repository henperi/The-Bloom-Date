'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _usersController = require('../controllers/usersController');

var _usersController2 = _interopRequireDefault(_usersController);

var _validateSignup = require('../middlewares/validate-signup');

var _validateSignup2 = _interopRequireDefault(_validateSignup);

var _Auth = require('../middlewares/Auth');

var _Auth2 = _interopRequireDefault(_Auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Import Relevant Middlewares
var router = _express2.default.Router();

/**
 * Attempt To Signup A New User
 */


// Import Relevant Controllers
router.post('/signup-1', _validateSignup2.default.stepOne, _usersController2.default.signupStepOne);
router.post('/signup-2', _Auth2.default.validateToken, _validateSignup2.default.stepTwo, _usersController2.default.signupStepTwo);
router.post('/signin', _validateSignup2.default.signin, _usersController2.default.signin);
router.get('/fetchProfile', _Auth2.default.validateToken, _usersController2.default.fetchProfile);
router.get('/fetchAllProfiles', _Auth2.default.validateToken, _Auth2.default.isAdmin, _usersController2.default.fetchAllProfiles);

router.use('', function (req, res) {
  return res.status(404).json({
    success: false,
    errorMsg: [{ msg: 'This endpoint does not exist' }]
  });
});

module.exports = router;