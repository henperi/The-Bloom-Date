'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var validateSignup = {
  /**
   * Validate stepOne
   */
  stepOne: function stepOne(req, res, next) {
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('passwordConfirmation', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ success: false, errors: errors });
    }
    return next();
  },

  /**
   * Validate stepTow
   */
  stepTwo: function stepTwo(req, res, next) {
    req.checkBody('country', 'Your country is required').notEmpty();
    req.checkBody('state', 'Your State is required').notEmpty();
    req.checkBody('tribe', 'Your tribe is required').notEmpty();
    req.checkBody('fullname', 'Your fullname is required').notEmpty();
    req.checkBody('gender', 'Your gender is required').notEmpty();
    req.checkBody('residence', 'Your residence is required').notEmpty();
    req.checkBody('heardFrom', 'Please tell us how you got to know about us').notEmpty();
    console.log(req.body);
    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ success: false, errors: errors });
    }

    var country = req.body.country;
    var state = req.body.state;
    var tribe = req.body.tribe;
    var fullname = req.body.fullname;
    var gender = req.body.gender;
    var residence = req.body.residence;
    var heardFrom = req.body.heardFrom;


    errors = [];
    var msg = void 0;

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
        errors: errors
      });
    }

    return next();
  },

  /**
   * Validate signin
   */
  signin: function signin(req, res, next) {
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
      return res.status(400).json({ success: false, errors: errors });
    }
    return next();
  }
};

exports.default = validateSignup;