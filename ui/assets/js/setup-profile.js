const countryInput = document.querySelector('.country');
const stateInput = document.querySelector('.state');
const tribeInput = document.querySelector('.tribe');

const fullnameInput = document.querySelector('.fullname');
const genderInput = document.querySelector('.gender');
const residenceInput = document.querySelector('.residence');

const facebookInput = document.querySelector('.facebook');
const instagramInput = document.querySelector('.instagram');
const whatsappInput = document.querySelector('.whatsapp');
const otherInput = document.querySelector('.other');

const loader = document.querySelector('.loader');
const submitForm = document.querySelector('form');
const responseArea = document.querySelector('.response-area');

const host = 'http://127.0.0.1:5500';

const userToken = localStorage.getItem('userToken');

if (!userToken) {
  responseArea.innerHTML = '<span class="list-group-item text-danger">You can\'t access this page</span>';
  setInterval(() => {
    window.location.href = `${host}/ui/sign-up.html`;
  }, 200);
}

if(userToken) {
  countryInput.addEventListener('change', () => {
    responseArea.innerHTML = '';
  });
  stateInput.addEventListener('change', () => {
    responseArea.innerHTML = '';
  });
  tribeInput.addEventListener('change', () => {
    responseArea.innerHTML = '';
  });
  
  const next = document.querySelector('#next');
  const back = document.querySelector('#back');
  
  const first = document.querySelector('#first');
  const second = document.querySelector('#second');
  const third = document.querySelector('#third');
  const finish = document.querySelector('#finish');
  
  let current = 1;
  back.classList.add('hide');
  
  const goToNext = () => {
    const country = countryInput.value;
    const state = stateInput.value;
    const tribe = tribeInput.value;
  
    const fullname = fullnameInput.value;
    const gender = genderInput.value;
    const residence = residenceInput.value;
  
    if (current < 3) {
      responseArea.innerHTML = '';
      if (current === 1) {
        if (!country || !state || !tribe) {
          return (responseArea.innerHTML = '<span class="text-danger vibrate list-group-item">All fields are required</span>');
        }
        first.classList.add('hide');
        back.classList.remove('hide');
        second.classList.remove('hide');
      }
      if (current === 2) {
        if (!fullname || !gender || !residence) {
          return (responseArea.innerHTML = '<span class="text-danger vibrate list-group-item">All fields are required</span>');
        }
        if (fullname.length < 4) {
          return (responseArea.innerHTML = '<span class="text-danger vibrate list-group-item">Your name is too short</span>');
        }
        second.classList.add('hide');
        third.classList.remove('hide');
        next.classList.add('hide');
        finish.classList.remove('hide');
      }
      current += 1;
    }
  };
  
  const goToPrevious = () => {
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
  
  submitForm.addEventListener('submit', (e) => {
    e.preventDefault();
    responseArea.innerHTML = '';
  
    const country = countryInput.value;
    const state = stateInput.value;
    const tribe = tribeInput.value;
  
    const fullname = fullnameInput.value;
    const gender = genderInput.value;
    const residence = residenceInput.value;
  
    const heardFrom = [];
  
    if (facebookInput.checked) {
      heardFrom.push('Facebook');
    }
    if (instagramInput.checked) {
      heardFrom.push('Instagram');
    }
    if (whatsappInput.checked) {
      heardFrom.push('Whatsapp');
    }
    if (otherInput.value) {
      heardFrom.push(otherInput.value);
    }
    // console.log(heardFrom)
    if (heardFrom.length < 1) {
      return (responseArea.innerHTML = '<span class="text-danger list-group-item">Kindly pick an option or fill the other box</span>');
    }
    loader.classList.remove('hide');
  
    const profileParams = {
      country,
      state,
      tribe,
      fullname,
      gender,
      residence,
      heardFrom,
    };
    const signinUrl = 'http://localhost:4200/api/v1/users/signup-2';
  
    fetch(signinUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8',
        'x-access-token': userToken,
      },
      body: JSON.stringify(profileParams),
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
        // localStorage.setItem('userToken', data.userToken);
        responseArea.innerHTML = data.success_msg || `<span class="text-success">${data.success_msg}</span>`;
        setInterval(() => {
          window.location.href = `${host}/ui/home.html`;
        }, 1000);
      })
      .catch((error) => {
        loader.classList.add('hide');
        responseArea.innerHTML = '<span class="list-group-item text-danger">A connection error occurred, try again in a moment</span>';
      });
  });
}
