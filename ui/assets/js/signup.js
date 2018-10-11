const emailInput = document.querySelector('.email');
const passwordInput = document.querySelector('.password');
const passwordConfirmationInput = document.querySelector('.passwordConfirmation');
const loader = document.querySelector('.loader');

const signUpForm = document.querySelector('form');
const responseArea = document.querySelector('.response-area');

const { host } = window.location;

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
  if (password.length < 6) {
    localMsg = { msg: 'Your password must be at least 6 characters' };
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
    return (responseArea.innerHTML = `<span class="list-group text-danger">${localErrorMsg}</span>`);
  }

  loader.classList.remove('hide');

  const signUpParams = {
    email,
    password,
    passwordConfirmation,
  };
  const signinUrl = 'https://bloom-date.herokuapp.com/api/v1/users/signup-1';

  fetch(signinUrl, {
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
          errorMsg += `<li class='list-group-item text-left'>${err.msg}</li>`;
        });
        loader.classList.add('hide');
        return (responseArea.innerHTML = `<span class="text-danger">${errorMsg}</span>`);
      }
      localStorage.setItem('userToken', data.userToken);
      responseArea.innerHTML = data.success_msg || `<span class="text-success">${data.success_msg}</span>`;
      setInterval(() => {
        window.location.href = `${host}/ui/set-up-profile.html`;
      }, 1000);
    })
    .catch((error) => {
      loader.classList.add('hide');
      responseArea.innerHTML = '<span class="list-group-item text-danger">A connection error occurred, try again in a moment</span>';
    });
});

const userToken = localStorage.getItem('userToken');
if (userToken) {
  loader.classList.remove('hide');
  responseArea.innerHTML = '<span class="list-group-item text-success">You already have an account, continue to your profile section</span>';
  setInterval(() => {
    window.location.href = `${host}/ui/set-up-profile.html`;
  }, 2000);
}
