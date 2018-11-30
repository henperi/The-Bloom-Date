'use strict';

var emailInput = document.querySelector('.email');
var passwordInput = document.querySelector('.password');
var passwordConfirmationInput = document.querySelector('.passwordConfirmation');
// const loader = document.querySelector('.loader');
// const responseArea = document.querySelector('.response-area');

var signUpForm = document.querySelector('form');

emailInput.addEventListener('keypress', function () {
  responseArea.innerHTML = '';
});
passwordInput.addEventListener('keypress', function () {
  responseArea.innerHTML = '';
});
passwordConfirmationInput.addEventListener('keypress', function () {
  responseArea.innerHTML = '';
});

signUpForm.addEventListener('submit', function (e) {
  e.preventDefault();
  responseArea.innerHTML = '';

  var email = emailInput.value;
  var password = passwordInput.value;
  var passwordConfirmation = passwordConfirmationInput.value;
  var localMsg = void 0;
  var localErrors = [];
  var localErrorMsg = '';

  if (email.length < 1) {
    localMsg = { msg: 'Your email can not be empty' };
    localErrors.push(localMsg);
  }
  if (password.length < 8) {
    localMsg = { msg: 'Your password must be at least 8 characters' };
    localErrors.push(localMsg);
  }
  if (password !== passwordConfirmation) {
    localMsg = { msg: 'Your passwords must match' };
    localErrors.push(localMsg);
  }

  if (localErrors.length > 0) {
    localErrors.forEach(function (err) {
      localErrorMsg += '<li class=\'list-group-item text-left\'>' + err.msg + '</li>';
    });
    responseArea.innerHTML = '<span class="list-group text-danger">' + localErrorMsg + '</span>';
    return;
  }

  loader.classList.remove('hide');

  var signUpParams = {
    email: email,
    password: password,
    passwordConfirmation: passwordConfirmation
  };

  var signupUrl = localAPI + '/users/signup-1';

  fetch(signupUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(signUpParams)
  }).then(function (res) {
    return res.json();
  }).then(function (data) {
    loader.classList.add('hide');
    if (data.errors) {
      var errors = data.errors;

      var errorMsg = '';
      errors.forEach(function (err) {
        errorMsg += '<li class=\'list-group-item text-danger\'>' + err.msg + '</li>';
      });
      loader.classList.add('hide');
      responseArea.innerHTML = errorMsg;
      return;
    }

    localStorage.setItem('userToken', data.userToken);
    localStorage.setItem('role', data.role);
    responseArea.innerHTML = '<li class="list-group-item text-success">' + data.success_msg + '</li>';

    setFlash('alert-success', "Let's quickly set up your profile");
    redirectTo('users/set-up-profile.html');
    // getUserProfile();
    // setInterval(() => {
    //   redirectTo('users/home.html');
    // }, 400);
  }).catch(function (error) {
    console.log(error);
    loader.classList.add('hide');
    responseArea.innerHTML = '<span class="list-group-item text-danger">A connection error occurred, try again in a moment</span>';
  });
});