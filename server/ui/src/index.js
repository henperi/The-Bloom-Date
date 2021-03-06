const loader = document.querySelector('.loader');
const responseArea = document.querySelector('.response-area');

const { origin } = window.location;
const localAPI = `${origin}/api/v1`;

const userToken = localStorage.getItem('userToken') || undefined;

/**
 * Custom Redirects: redirect the user to a certain page
 * @param {String} url The link to redirect to
 * @param {boolean} canReturn The posibility of coming back with back button
 */
const redirectTo = (url, canReturn) => {
  // Redirect with previous href history
  if (canReturn) {
    window.location.href = url;
    return;
  }
  // Redirect and remove the previous href from history
  window.location.replace(url);
};

/**
 * Set A flash to be called on the next page
 * @param {String} flashType The flash type (flash-success || flash-error)
 * @param {String} flashMsg The message to flash
 */
const setFlash = (flashType, flashMsg) => {
  const flash = [flashType, flashMsg];
  localStorage.setItem('flash', JSON.stringify(flash));
};

/**
 * Instantly create the flash object and call the flash method
 * @param {String} flashType The flash type (flash-success || flash-error)
 * @param {String} flashMsg The message to flash
 */
const flash = (flashtype, flashMsg) => {
  const flashbox = document.createElement('div');
  flashbox.className = `container card text-center flash alert ${flashtype}`;
  flashbox.innerHTML = `
    <p>${flashMsg}</p>
  `;
  document.querySelector('.row').insertAdjacentElement('afterbegin', flashbox);
  setInterval(() => {
    document.querySelector('.row').removeChild(flashbox);
  }, 2000);
};

/**
 * Render the poor network page
 */
const renderPoorNetwork = () => `
<div class="container text-center">
  <section class="">
    <h3 class="list-item text-red t-28">Poor network detected, refresh or try again in a moment</h3>
    <div class="loader hide">
      <i class="fa fa-spin fa-spinner"></i>
    </div>
    <button class="btn btn-primary reload">Reconnect</button>
    </section>
</div>
`;

/**
 * Get The Authenticated User Profile
 */
const getUserProfile = () => {
  const userToken = localStorage.getItem('userToken') || undefined;
  if (userToken) {
    const fetchProfileUrl = `${localAPI}/users/fetchProfile`;

    fetch(fetchProfileUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8',
        'x-access-token': userToken,
      },
    })
      .then(res => res.json())
      .then((data) => {
        console.log('data:', data);
        // Profile was not found
        if (!data.success) {
          // calling this from login page
          if (window.location.pathname === '/login.html') {
            document.querySelector('.row').innerHTML = '';
            flash('alert-danger', `${data.success_msg}, redirecting you...`);
            redirectTo('/users/set-up-profile.html', true);
            return;
          }
          // calling from any other page
          if (window.location.pathname !== '/users/set-up-profile.html') {
            document.querySelector('.row').innerHTML = '';
            flash('alert-danger', `${data.success_msg}, redirecting you...`);
            redirectTo('set-up-profile.html', true);
            return;
          }
          // redirectTo('users/set-up-profile.html', true);
          // return;
        }

        // Profile fetched
        if (data.success_msg === 'Your profile has been fetched') {
          localStorage.setItem('fullname', data.data.fullname);
          const firstname = localStorage.getItem('fullname').split(' ')[0];

          // If its in the setup profile page
          if (window.location.pathname === '/users/set-up-profile.html') {
            responseArea.innerHTML = '<span class="text-success">You already have a profile, redirecting you...</span>';

            flash('alert-success', 'You already have a profile, redirecting...');
            setFlash('alert-success', 'You already have a profile, redirecting...');
            redirectTo('home.html');
            // return;
          }
          // If its in the login page
          if (window.location.pathname === '/login.html') {
            responseArea.innerHTML = '<span class="text-success">You already have a profile, redirecting you...</span>';

            setFlash('alert-success', `Welcome back ${firstname}`);
            redirectTo('users/home.html');
          }
        }
      })
      .catch((error) => {
        console.log(error);
        loader.classList.add('hide');
        responseArea.innerHTML = `
        <li class="list-group-item text-danger">
          A connection error occurred, try again in a moment
        </li>`;
      });
  }
  if (!userToken) {
    localStorage.clear();
    flash('alert-danger', 'You need to login to access this page');
    setFlash('alert-danger', 'You need to login to access this page');
    redirectTo('../login.html');
  }
};

// Check for flash messages
const flashMsg = localStorage.getItem('flash') || undefined;
if (flashMsg) {
  const flashContent = JSON.parse(flashMsg);
  flash(flashContent[0], flashContent[1]);
  localStorage.removeItem('flash');
}

// Default actions that can be performed on a few app pages
const appActions = (event) => {
  if (event.target.classList.contains('logout')) {
    localStorage.clear();
    redirectTo('../login.html', false);
    setFlash('alert-danger', 'You have logged out from Bloom Date');
  }
  if (event.target.classList.contains('js-maintenance')) {
    document.querySelector('.row').innerHTML = `
    <div class="col-12 u-mt-80 text-center">
      <h1 class="display-4 u-fw-500 text-white u-mb-40">
        Temporarily Under Maintenance...
      </h1>
      <a href="javascript:;" class="btn btn btn-rounded btn-primary m-2 px-md-5 py-3 js-maintenance">
        loading...<i class="fa fa-spin fa-spinner"></i>
      </a>
    </div>
    `;
    flash(
      'alert-danger',
      "<p class='h1 text-danger'>Sorry, we're currently closed for maintenance, check again soon...</p>",
    );
    // redirectTo('../login.html', false);
  }
  if (event.target.classList.contains('reload')) {
    document.querySelector('.loader').classList.remove('hide');
    setInterval(() => {
      window.location.reload();
    }, 800);
  }
};

window.addEventListener('click', appActions);
