'use strict';

var countryInput = document.querySelector('.country');
var stateInput = document.querySelector('.state');
var tribeInput = document.querySelector('.tribe');

var fullnameInput = document.querySelector('.fullname');
var genderInput = document.querySelector('.gender');
var birthdayInput = document.querySelector('.birthday');
var residenceInput = document.querySelector('.residence');

// const facebookInput = document.querySelector('.facebook');
// const instagramInput = document.querySelector('.instagram');
// const whatsappInput = document.querySelector('.whatsapp');
// const AdInput = document.querySelector('.Ad');
// const TvInput = document.querySelector('.Tv');
// const otherInput = document.querySelector('.other');

// const radioInput = document.querySelectorAll('input[name="heardFrom"]');
// console.log(radioInput);

var heardFrom = '';
var otherTextField = document.querySelector('.heard-from-other-text');
var otherRadioField = document.querySelector('.heard-from-other-radio');

console.log(otherTextField.value);

otherTextField.addEventListener('keyup', function () {
  heardFrom = otherTextField.value;
});

var TRIBE = '';
var tribeModal = document.querySelector('.tribe-modal');

tribeModal.addEventListener('keyup', function () {
  TRIBE = tribeModal.value;
  document.querySelector('.otherTribe').innerHTML = TRIBE;
});

window.addEventListener('click', function (e) {
  if (e.target.classList.contains('tribe')) {
    e.target.options[0].value = 'x';
    if (e.target.value === '') {
      var targetModal = e.srcElement.getAttribute('data-target');
      document.getElementById('#' + targetModal).classList.add('show-modal');
    }
    if (e.target.value !== '') {
      document.querySelector('.otherTribe').innerHTML = 'Other';
      document.querySelector('.close-button').click();
    }
    if (e.target.classList.contains('close-button')) {
      var modalToClose = e.target.offsetParent.offsetParent.getAttribute('id');
      document.getElementById(modalToClose).classList.remove('show-modal');
      // document.querySelector('.otherTribe').innerHTML = "Other";
    }
    e.target.options['0'].value = '';
  }
  if (e.target.name === 'heardFrom') {
    heardFrom = e.target.value;

    if (e.target.type === 'text') {
      otherRadioField.click();
    }
    if (!heardFrom) {
      otherTextField.focus();
      heardFrom = otherTextField.value;
    }
    console.log(heardFrom);
  }
});

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
  localStorage.getItem('role') === 'Admin' ? getAdminProfile() : getUserProfile();
  // getUserProfile();

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
    var tribe = tribeInput.value || TRIBE;

    var fullname = fullnameInput.value;
    var gender = genderInput.value;
    var birthday = birthdayInput.value;
    var residence = residenceInput.value;

    console.log('TribeV::', tribe);
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
        if (!fullname || !gender || !birthday || !residence) {
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
    var tribe = tribeInput.value || TRIBE;

    var fullname = fullnameInput.value;
    var gender = genderInput.value;
    var residence = residenceInput.value;
    var birthday = birthdayInput.value;

    if (!heardFrom) {
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