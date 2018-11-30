'use strict';

var countryInput = document.querySelector('.country');
var stateInput = document.querySelector('.state');
var tribeInput = document.querySelector('.tribe');

var fullnameInput = document.querySelector('.fullname');
var genderInput = document.querySelector('.gender');
var birthdayInput = document.querySelector('.birthday');
var residenceInput = document.querySelector('.residence');

var facebookInput = document.querySelector('.facebook');
var instagramInput = document.querySelector('.instagram');
var whatsappInput = document.querySelector('.whatsapp');
var AdInput = document.querySelector('.Ad');
var TvInput = document.querySelector('.Tv');
var otherInput = document.querySelector('.other');

// const loader = document.querySelector('.loader');
// const responseArea = document.querySelector('.response-area');
var submitForm = document.querySelector('form');

if (!userToken) {
  responseArea.innerHTML = '<span class="list-group-item text-danger">You need to login to access this page</span>';
  flash('alert-error', 'Unable to authenticate you, Please login again');
  setFlash('alert-error', 'Unable to authenticate you, Please login again');
  redirectTo('../login.html');
}

if (userToken) {
  getUserProfile();

  countryInput.addEventListener('change', function () {
    responseArea.innerHTML = '';
  });
  stateInput.addEventListener('change', function () {
    responseArea.innerHTML = '';
  });
  tribeInput.addEventListener('change', function () {
    responseArea.innerHTML = '';
  });

  var next = document.querySelector('#next');
  var back = document.querySelector('#back');

  var first = document.querySelector('#first');
  var second = document.querySelector('#second');
  var third = document.querySelector('#third');
  var finish = document.querySelector('#finish');

  var current = 1;
  back.classList.add('hide');

  // Go to next action button
  var goToNext = function goToNext() {
    var country = countryInput.value;
    var state = stateInput.value;
    var tribe = tribeInput.value;

    var fullname = fullnameInput.value;
    var gender = genderInput.value;
    var residence = residenceInput.value;

    if (current < 3) {
      responseArea.innerHTML = '';
      if (current === 1) {
        if (!country || !state || !tribe) {
          responseArea.innerHTML = '<span class="text-danger vibrate list-group-item">All fields are required</span>';
          return;
        }
        first.classList.add('hide');
        back.classList.remove('hide');
        second.classList.remove('hide');
      }
      if (current === 2) {
        if (!fullname || !gender || !residence) {
          responseArea.innerHTML = '<span class="text-danger vibrate list-group-item">All fields are required</span>';
          return;
        }
        if (fullname.length < 4) {
          responseArea.innerHTML = '<span class="text-danger vibrate list-group-item">Your name is too short</span>';
          return;
        }
        second.classList.add('hide');
        third.classList.remove('hide');
        next.classList.add('hide');
        finish.classList.remove('hide');
      }
      current += 1;
    }
  };

  // Go to previous
  var goToPrevious = function goToPrevious() {
    if (current > 1) {
      responseArea.innerHTML = '';
      if (current === 3) {
        finish.classList.add('hide');
        next.classList.remove('hide');
        second.classList.remove('hide');
        second.classList.add('slide-from-left');
        third.classList.add('hide');
      }
      if (current === 2) {
        second.classList.add('hide');
        back.classList.add('hide');
        first.classList.remove('hide');
        first.classList.add('slide-from-left');
      }
      current -= 1;
    }
  };

  next.addEventListener('click', goToNext);
  back.addEventListener('click', goToPrevious);

  // Submit the set up profile form
  submitForm.addEventListener('submit', function (e) {
    e.preventDefault();
    responseArea.innerHTML = '';

    var country = countryInput.value;
    var state = stateInput.value;
    var tribe = tribeInput.value;

    var fullname = fullnameInput.value;
    var gender = genderInput.value;
    var residence = residenceInput.value;
    var birthday = birthdayInput.value;

    var heardFrom = [];

    if (facebookInput.checked) {
      heardFrom.push('Facebook');
    }
    if (instagramInput.checked) {
      heardFrom.push('Instagram');
    }
    if (whatsappInput.checked) {
      heardFrom.push('Whatsapp');
    }
    if (AdInput.checked) {
      heardFrom.push('Ad on my phone');
    }
    if (TvInput.checked) {
      heardFrom.push('Tv');
    }
    if (otherInput.value) {
      heardFrom.push(otherInput.value);
    }

    if (heardFrom.length < 1) {
      responseArea.innerHTML = '<span class="text-danger list-group-item">Kindly pick an option or fill the other box</span>';
      return;
    }
    loader.classList.remove('hide');

    var profileParams = {
      country: country,
      state: state,
      tribe: tribe,
      fullname: fullname,
      gender: gender,
      birthday: birthday,
      residence: residence,
      heardFrom: heardFrom
    };

    var setUpProfileUrl = localAPI + '/users/signup-2';

    fetch(setUpProfileUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8',
        'x-access-token': userToken
      },
      body: JSON.stringify(profileParams)
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
      localStorage.setItem('fullname', fullname);
      responseArea.innerHTML = '<span class="text-success">' + data.success_msg + '</span>';
      redirectTo('home.html');
      // setInterval(() => {
      //   window.location.href = 'home.html';
      // }, 5000);
    }).catch(function (error) {
      console.log(error);
      loader.classList.add('hide');
      responseArea.innerHTML = '<span class="list-group-item text-danger">A connection error occurred, try again in a moment</span>';
    });
  });
}