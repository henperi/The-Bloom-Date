import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import expressValidator from 'express-validator';
import 'babel-polyfill';

import allRoutes from './src/routes/index';

const app = express();

// Static assets
app.use(express.static('server/ui'));

// Some neccessary middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Origin, x-access-token, Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    return res.status(200).json({});
  }
  return next();
});

// Express Validator Middleware
app.use(
  expressValidator({
    errorFormatter: (param, msg) => ({
      msg,
    }),
  }),
);

const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'test@example.com',
  from: 'test@example.com',
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail
  .send(msg)
  .then(() => {
    console.log('success');
    return 'Email sent';
  })
  .catch((error) => {
    // Log friendly error message
    console.log('error', error);
  });

app.use('/api/v1/', allRoutes);

app.use('/', (req, res) => res.status(404).json({
  success: false,
  errorMsg: [{ msg: 'This endpoint does not exist' }],
}));

// Define The Port and Host
const PORT = process.env.PORT || 4200;

// Start the node server
app.listen(PORT, () => {
  console.log(`Server Started Successfully On PORT: ${PORT}`);
});

export default app;
