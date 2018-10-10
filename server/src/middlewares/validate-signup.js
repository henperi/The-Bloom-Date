const validateSignup = {
  /**
   * Validate stepOne
   */
  stepOne(req, res, next) {
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password_confirmation', 'Passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ success: false, errors });
    }
    return next();
  },
  /**
   * Validate stepTow
   */
  stepTwo(req, res, next) {
    req.checkBody('country', 'Your country is required').notEmpty();
    req.checkBody('state', 'Your State is required').notEmpty();
    req.checkBody('tribe', 'Your tribe is required').notEmpty();
    req.checkBody('fullname', 'Your fullname is required').notEmpty();
    req.checkBody('gender', 'Your gender is required').notEmpty();
    req.checkBody('residence', 'Your residence is required').notEmpty();
    req.checkBody('heardFrom', 'Please tell us how you got to know about us').notEmpty();

    let errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ success: false, errors });
    }

    const { country } = req.body;
    const { state } = req.body;
    const { tribe } = req.body;
    const { fullname } = req.body;
    const { gender } = req.body;
    const { residence } = req.body;
    const { heardFrom } = req.body;

    errors = [];
    let msg;

    if (country.length < 3) {
      msg = { msg: 'Your country name is too short' };
      errors.push(msg);
    }
    if (country.length > 30) {
      msg = { msg: 'Your country name is too long' };
      errors.push(msg);
    }

    if (state.length < 3) {
      msg = { msg: 'Your state name is too short' };
      errors.push(msg);
    }
    if (state.length > 30) {
      msg = { msg: 'Your state name is too long' };
      errors.push(msg);
    }

    if (tribe.length < 3) {
      msg = { msg: 'Your tribe name is too short' };
      errors.push(msg);
    }
    if (tribe.length > 30) {
      msg = { msg: 'Your tribe name is too long' };
      errors.push(msg);
    }

    if (fullname.length < 3) {
      msg = { msg: 'Your fullname name is too short' };
      errors.push(msg);
    }
    if (fullname.length > 30) {
      msg = { msg: 'Your fullname name is too long' };
      errors.push(msg);
    }

    if (!Number.isInteger(Number(gender))) {
      msg = { msg: 'Your Gender is invalid' };
      errors.push(msg);
    }
    if (Number(gender) > 1) {
      msg = { msg: 'Your Gender type is not valid' };
      errors.push(msg);
    }

    if (residence.length < 3) {
      msg = { msg: 'Your residence name is too short' };
      errors.push(msg);
    }
    if (residence.length > 30) {
      msg = { msg: 'Your residence name is too long' };
      errors.push(msg);
    }

    if (!heardFrom) {
      msg = { msg: 'Kindly tell us how you got to know about us' };
      errors.push(msg);
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        errors,
      });
    }

    return next();
  },
  /**
   * Validate signin
   */
  signin(req, res, next) {
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ success: false, errors });
    }
    return next();
  },
};

export default validateSignup;
