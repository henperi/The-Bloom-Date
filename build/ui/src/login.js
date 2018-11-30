'use strict';

var emailInput = document.querySelector('.email');
var passwordInput = document.querySelector('.password');
// const loader = document.querySelector('.loader');
// const responseArea = document.querySelector('.response-area');

var signin = document.querySelector('form');

emailInput.addEventListener('keypress', function () {
  responseArea.innerHTML = '';
});
passwordInput.addEventListener('keypress', function () {
  responseArea.innerHTML = '';
});

signin.addEventListener('submit', function (e) {
  e.preventDefault();
  responseArea.innerHTML = '';

  var email = emailInput.value;
  var password = passwordInput.value;
  var localMsg = void 0;
  var localErrors = [];
  var localErrorMsg = '';

  if (email.length < 1) {
    localMsg = { msg: 'Your email can not be empty' };
    localErrors.push(localMsg);
  }
  if (password.length < 1) {
    localMsg = { msg: 'Your password can not be empty' };
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

  var signinParams = {
    email: email,
    password: password
  };

  var signinUrl = localAPI + '/users/signin';

  fetch(signinUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8'
    },
    body: JSON.stringify(signinParams)
  }).then(function (res) {
    return res.json();
  }).then(function (data) {
    loader.classList.add('hide');
    if (data.errors) {
      var errors = data.errors;

      var errorMsg = '';
      errors.forEach(function (err) {
        errorMsg += '<li class=\'list-group-item text-left\'>' + err.msg + '</li>';
      });
      loader.classList.add('hide');
      responseArea.innerHTML = '<span class="text-danger">' + errorMsg + '</span>';
      return;
    }
    localStorage.setItem('userToken', data.userToken);
    localStorage.setItem('role', data.role);
    responseArea.innerHTML = '<li class="list-group-item text-success">' + data.success_msg + '</li>';

    flash('alert-success', 'Loging you in');
    getUserProfile();
  }).catch(function (error) {
    loader.classList.add('hide');
    responseArea.innerHTML = '<span class="list-group-item text-danger">A connection error occurred, try again in a moment</span>';
  });
});

// const userToken = localStorage.getItem('userToken');

// if (userToken) {
//   loader.classList.remove('hide');
//   responseArea.innerHTML = '<span class="list-group-item text-success">You already have an account, continue to your profile section</span>';
//   setInterval(() => {
//     window.location.href = 'set-up-profile.html';
//   }, 2000);
// }