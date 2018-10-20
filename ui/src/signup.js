const emailInput = document.querySelector('.email');
const passwordInput = document.querySelector('.password');
const passwordConfirmationInput = document.querySelector('.passwordConfirmation');
// const loader = document.querySelector('.loader');
// const responseArea = document.querySelector('.response-area');

const signUpForm = document.querySelector('form');

emailInput.addEventListener('keypress', () => {
  responseArea.innerHTML = '';
});
passwordInput.addEventListener('keypress', () => {
  responseArea.innerHTML = '';
});
passwordConfirmationInput.addEventListener('keypress', () => {
  responseArea.innerHTML = '';
});

signUpForm.addEventListener('submit', (e) => {
  e.preventDefault();
  responseArea.innerHTML = '';

  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConfirmation = passwordConfirmationInput.value;
  let localMsg;
  const localErrors = [];
  let localErrorMsg = '';

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
    localErrors.forEach((err) => {
      localErrorMsg += `<li class='list-group-item text-left'>${err.msg}</li>`;
    });
    responseArea.innerHTML = `<span class="list-group text-danger">${localErrorMsg}</span>`;
    return;
  }

  loader.classList.remove('hide');

  const signUpParams = {
    email,
    password,
    passwordConfirmation,
  };

  const signupUrl = `${localAPI}/users/signup-1`;

  fetch(signupUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(signUpParams),
  })
    .then(res => res.json())
    .then((data) => {
      loader.classList.add('hide');
      if (data.errors) {
        const { errors } = data;
        let errorMsg = '';
        errors.forEach((err) => {
          errorMsg += `<li class='list-group-item text-danger'>${err.msg}</li>`;
        });
        loader.classList.add('hide');
        responseArea.innerHTML = errorMsg;
        return;
      }

      localStorage.setItem('userToken', data.userToken);
      localStorage.setItem('role', data.role);
      responseArea.innerHTML = `<li class="list-group-item text-success">${data.success_msg}</li>`;

      setFlash('alert-success', "Let's quickly set up your profile");
      redirectTo('users/set-up-profile.html');
      // getUserProfile();
      // setInterval(() => {
      //   redirectTo('users/home.html');
      // }, 400);
    })
    .catch((error) => {
      console.log(error);
      loader.classList.add('hide');
      responseArea.innerHTML = '<span class="list-group-item text-danger">A connection error occurred, try again in a moment</span>';
    });
});
