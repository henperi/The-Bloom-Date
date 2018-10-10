const emailInput = document.querySelector('.email');
const passwordInput = document.querySelector('.password');
const passwordConfirmationInput = document.querySelector('.passwordConfirmation');
const signUpForm = document.querySelector('form');
const responseArea = document.querySelector('.response-area');

const host = 'http://127.0.0.1:5500';

signUpForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;
  const passwordConfirmation = passwordConfirmationInput.value;

  const signUpParams = {
    email,
    password,
    passwordConfirmation,
  };
  // alert(signUpParams);
  console.log(signUpParams);
  const signinUrl = 'http://localhost:4200/api/v1/users/signup-1';

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
      console.log(data);
      if (data.errors) {
        const { errors } = data;
        let errorMsg = '';
        errors.forEach((err) => {
          errorMsg += `<li class='text-left'>${err.msg}</li>`;
          // console.log(msg.msg);
        });
        return (responseArea.innerHTML = `<span class="text-danger">${errorMsg}</span>`);
      }
      localStorage.setItem('userToken', data.userToken);
      responseArea.innerHTML = data.success_msg || `<span class="text-success">${data.success_msg}</span>`;
      setInterval(() => {
        window.location.href = `${host}/ui/set-up-profile.html`;
      }, 1000);
    })
    .catch(
      error => (responseArea.innerHTML = '<span class="text-danger">A connection error occurred, try again latter</span>'),
    );
});

const userToken = localStorage.getItem('userToken');
if (userToken) {
  responseArea.innerHTML = '<span class="text-success">You already have an account, complete your profile</span>';
  setInterval(() => {
    window.location.href = `${host}/ui/set-up-profile.html`;
  }, 1000);
}
