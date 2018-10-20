import User from '../models/User';
import helper from './helper';

const usersController = {
  async signupStepOne(req, res) {
    const email = req.body.email.toLowerCase();
    const { password } = req.body;
    const role = 'User';

    const errors = [];
    let msg;

    if (password.length < 8) {
      msg = { msg: 'Your Password must be at least 8 characters' };
      errors.push(msg);
    }
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    const findUser = await User.findByEmail(req, res, email);
    if (findUser) {
      msg = { msg: 'This email has already been taken' };
      errors.push(msg);

      return res.status(409).json({
        success: false,
        errors,
      });
    }

    const hashPassword = helper.hashPassword(password);
    const newUser = {
      email,
      hashPassword,
      role,
    };
    const createUser = await User.createUser(req, res, newUser);

    if (createUser.success) {
      const userToken = helper.generateToken(createUser.rows.id, createUser.rows.email);
      console.log(createUser.rows);
      return res.status(201).json({
        success: true,
        success_msg: 'Account creation was successful, complete your profile',
        userToken,
        role: createUser.rows.role,
      });
    }
  },

  async signupStepTwo(req, res) {
    const { userId } = req.user;
    let { gender } = req.body;

    if (Number(gender) === 1) {
      gender = 'Male';
    } else {
      gender = 'Female';
    }

    req.body.userId = userId;
    req.body.gender = gender;

    const insertProfile = await User.insertUserProfile(req, res, req.body);

    if (insertProfile.success) {
      return res.status(201).json({
        success: true,
        success_msg: 'Your profile has been successfully set up, redirecting to home page',
        data: insertProfile.rows,
      });
    }
  },

  async signin(req, res) {
    const email = req.body.email.toLowerCase();
    const { password } = req.body;

    const findUser = await User.findByEmail(req, res, email);

    if (!findUser) {
      return res.status(404).json({
        success: false,
        errors: [{ msg: 'Your email does not exist' }],
      });
    }
    const checkPassword = helper.comparePassword(findUser.password, password);

    if (!checkPassword) {
      return res.status(404).json({
        success: false,
        errors: [{ msg: 'Your password is wrong' }],
      });
    }

    const userToken = helper.generateToken(findUser.id, findUser.email);
    return res.status(200).json({
      success: true,
      success_msg: 'Your signin was successful',
      userToken,
      role: findUser.role,
    });
  },

  async fetchProfile(req, res) {
    const { userId } = req.user;

    const fetchProfile = await User.searchProfile(req, res, userId);
    if (fetchProfile) {
      return res.status(200).json({
        success: true,
        success_msg: 'Your profile has been fetched',
        data: fetchProfile,
      });
    }
    return res.status(404).json({
      success: false,
      success_msg: 'You have not set up your profile',
    });
  },
};

export default usersController;
