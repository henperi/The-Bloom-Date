'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _users = require('./users');

var _users2 = _interopRequireDefault(_users);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
/**
 * Users Route
 */
router.use('/users', _users2.default);

router.use('', function (req, res, next) {
  return res.status(404).json({
    success: false,
    errorMsg: [{ msg: 'This endpoint does not exist' }]
  });
});

module.exports = router;