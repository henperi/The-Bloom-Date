const emailInput = document.querySelector('.email');
const passwordInput = document.querySelector('.password');
const loader = document.querySelector('.loader');

const signin = document.querySelector('form');
const responseArea = document.querySelector('.response-area');

const { host } = window.location;

emailInput.addEventListener('keypress', () => {
  responseArea.innerHTML = '';
});
passwordInput.addEventListener('keypress', () => {
  responseArea.innerHTML = '';
});

signin.addEventListener('submit', (e) => {
  e.preventDefault();
  responseArea.innerHTML = '';

  const email = emailInput.value;
  const password = passwordInput.value;
  let localMsg;
  const localErrors = [];
  let localErrorMsg = '';

  if (email.length < 1) {
    localMsg = { msg: 'Your email can not be empty' };
    localErrors.push(localMsg);
  }
  if (password.length < 1) {
    localMsg = { msg: 'Your password can not be empty' };
    localErrors.push(localMsg);
  }
  if (localErrors.length > 0) {
    localErrors.forEach((err) => {
      localErrorMsg += `<li class='list-group-item text-left'>${err.msg}</li>`;
    });
    return (responseArea.innerHTML = `<span class="list-group text-danger">${localErrorMsg}</span>`);
  }

  loader.classList.remove('hide');

  const signinParams = {
    email,
    password,
  };
  // https://bloom-date.herokuapp.com
  const signinUrl = 'https://bloom-date.herokuapp.com/api/v1/users/signin';

  fetch(signinUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json, text/plain, */*',
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(signinParams),
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
        window.location.href = 'set-up-profile.html';
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
    window.location.href = 'set-up-profile.html';
  }, 2000);
}
