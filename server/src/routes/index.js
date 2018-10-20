import express from 'express';
import usersRoute from './users';

const router = express.Router();
/**
 * Users Route
 */
router.use('/users', usersRoute);

router.use('', (req, res, next) => res.status(404).json({
  success: false,
  errorMsg: [{ msg: 'This endpoint does not exist' }],
}));

module.exports = router;
