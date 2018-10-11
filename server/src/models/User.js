import randomId from 'uuid';
import db from './queryHelper';

class User {
  constructor() {
    this.users = db;
  }

  /**
   * Find User By Email
   * @param {email} email
   * @returns {object} user object
   */
  async findByEmail(req, res, email) {
    const queryText = 'SELECT * FROM users WHERE email = $1';
    try {
      const { rows } = await this.users.query(queryText, [email]);
      return rows[0];
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        errors: [{ msg: 'An error occured, while processing this request, try again in a moment' }],
      });
    }
  }

  /**
   * Check if a user has inserted his profile
   * @param {userId} userId
   * @returns {object} user profile
   */
  async searchProfile(req, res, userId) {
    const queryText = 'SELECT * FROM profiles WHERE user_id = $1';
    try {
      const { rows } = await this.users.query(queryText, [userId]);
      return rows[0];
    } catch (err) {
      return res.status(500).json({
        success: false,
        errors: [{ msg: 'An error occured, while processing this request, try again in a moment' }],
      });
    }
  }

  /**
   * Create user account
   * @param {*} data
   * @returns {object} user ubject
   */
  async createUser(req, res, data) {
    console.log('DATA::', data);
    const queryText = `INSERT INTO users(id, email, 
      password, role, created_at, updated_at)
      Values($1, $2, $3, $4, $5, $6)
      returning *`;
    const values = [
      randomId.v1(),
      data.email,
      data.hashPassword,
      data.role,
      new Date(),
      new Date(),
    ];

    try {
      const { rows } = await this.users.query(queryText, values);
      const response = { success: true, rows: rows[0] };
      return response;
    } catch (err) {
      return res.status(500).json({
        success: false,
        errors: [{ msg: 'An error occured' }],
      });
    }
  }

  /**
   * Create/Insert the user profile account
   * @param {*} data
   * @returns {object} user ubject
   */
  async insertUserProfile(req, res, data) {
    console.log('DARA', data);
    const queryText = `INSERT INTO profiles(user_id, fullname, 
      gender, residence, country, state, tribe, heard_from, created_at, updated_at)
      Values($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      returning *`;
    const values = [
      data.userId,
      data.fullname,
      data.gender,
      data.residence,
      data.country,
      data.state,
      data.tribe,
      data.heardFrom,
      new Date(),
      new Date(),
    ];

    try {
      const { rows } = await this.users.query(queryText, values);
      const response = { success: true, rows: rows[0] };
      return response;
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        success: false,
        errors: [{ msg: 'An error occured try again' }],
      });
    }
  }
}

export default new User();
