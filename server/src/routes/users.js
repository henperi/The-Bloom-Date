import express from 'express';

// Import Relevant Controllers
import usersController from '../controllers/usersController';

// Import Relevant Middlewares
import validateSignup from '../middlewares/validate-signup';
import Auth from '../middlewares/Auth';

const router = express.Router();

/**
 * Attempt To Signup A New User
 */
router.post('/signup-1', validateSignup.stepOne, usersController.signupStepOne);
router.post('/signup-2', Auth.validateToken, validateSignup.stepTwo, usersController.signupStepTwo);
router.post('/signin', validateSignup.signin, usersController.signin);
router.get('/fetchProfile', Auth.validateToken, usersController.fetchProfile);

router.use('', (req, res) => res.status(404).json({
  success: false,
  errorMsg: [{ msg: 'This endpoint does not exist' }],
}));

module.exports = router;
