'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _expressValidator = require('express-validator');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

require('babel-polyfill');

var _index = require('./src/routes/index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// Static assets
app.use(_express2.default.static('server/ui'));

// Some neccessary middleware
app.use(_bodyParser2.default.urlencoded({ extended: true }));
app.use(_bodyParser2.default.json());
app.use((0, _morgan2.default)('dev'));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, x-access-token, Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  return next();
});

// Express Validator Middleware
app.use((0, _expressValidator2.default)({
  errorFormatter: function errorFormatter(param, msg) {
    return {
      msg: msg
    };
  }
}));

var sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
var msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>'
};
sgMail.send(msg).then(function () {
  console.log('success');
  return 'Email sent';
}).catch(function (error) {
  // Log friendly error message
  console.log('error', error);
});

app.use('/api/v1/', _index2.default);

app.use('/', function (req, res) {
  return res.status(404).json({
    success: false,
    errorMsg: [{ msg: 'This endpoint does not exist' }]
  });
});

// Define The Port and Host
var PORT = process.env.PORT || 4200;

// Start the node server
app.listen(PORT, function () {
  console.log('Server Started Successfully On PORT: ' + PORT);
});

exports.default = app;