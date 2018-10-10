import jwt from 'jsonwebtoken';
import db from '../models/queryHelper';

const Auth = {
  /**
   * Verify Token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async validateToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
      return res.status(400).send({
        success: false,
        errors: [{ msg: 'Authorization failed, Please log in to your account to continue' }],
      });
    }
    try {
      const decodedToken = await jwt.verify(token, process.env.JWT_KEY);
      // console.log('DT', decodedToken);
      const queryText = 'SELECT * FROM users WHERE id = $1';
      const { rows } = await db.query(queryText, [decodedToken.userId]);
      if (!rows[0]) {
        return res.status(400).send({
          success: false,
          errors: [
            {
              msg: 'Authorization failed, unable to validate your account, please login again',
            },
          ],
        });
      }
      req.user = { userId: decodedToken.userId, userRole: rows[0].role };
      return next();
    } catch (error) {
      return res.status(401).send({
        success: false,
        errors: [
          {
            msg: 'An error occured while attempting to authenticate you, please try to login again',
          },
        ],
      });
    }
  },

  /**
   * Validate Admin Role
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async isUser(req, res, next) {
    // console.log('role', req.userRole);
    if (req.userRole !== 'User') {
      return res.status(401).send({
        success: false,
        errors: [{ msg: 'Unauthorized access, only users are allowed to do this' }],
      });
    }
    return next();
  },

  /**
   * Validate Admin Role
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object|void} response object
   */
  async isAdmin(req, res, next) {
    // console.log('role', req.userRole);
    if (req.userRole !== 'Admin') {
      return res.status(401).send({
        success: false,
        errors: [{ msg: 'Unauthorized access, only admins can access this area' }],
      });
    }
    return next();
  },
};

export default Auth;
