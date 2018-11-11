getAdminProfile();

const firstname = localStorage.getItem('fullname').split(' ')[0];
// document.querySelector('.fullname').innerHTML = firstname;

/**
 * Get The Authenticated User Profile
 */
const fetchAllProfiles = () => {
  const userToken = localStorage.getItem('userToken') || undefined;
  if (userToken) {
    const fetchAllProfilesUrl = `${localAPI}/users/fetchAllProfiles`;

    fetch(fetchAllProfilesUrl, {
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
        // console.log('data:', data);
        // Profile was not found
        if (!data.success) {
          // Render the no profile found message
          document.querySelector('.users-count').innerHTML = 'No Registered Users Yet';
        }

        // Profile fetched
        if (data.success) {
          // Render the User profiles
          const profile = data.data;

          const profilesSection = document.querySelector('.profiles-section');
          document.querySelector('.users-count').innerHTML = `Registered Users (${profile.length})`;
          profilesSection.innerHTML = '';
          for (let i = 0; i < profile.length; i += 1) {
            const profilesTemplate = `
            <div class="col-md-4 mt-4">
              <div class="bg-white box-shadow-v2 rounded py-5">
              <img src="/assets/img/svg/phone-book.svg" class="u-h-90" alt="">
                <h4 class="u-mb-35 u-mt-15">
                  ${profile[i].fullname}
                </h4>
                <hr class="m-0">
                <ul class="list-unstyled u-py-30 u-lh-2">
                <li><strong>State</strong> ${profile[i].state}</li>
                <li><strong>Residence</strong> ${profile[i].residence}</li>
                <li><strong>Tribe</strong> ${profile[i].tribe}</li>
                <li><strong>Gender</strong> ${profile[i].gender}</li>
                  <li><strong>Birthday</strong> ${profile[i].birthday}</li>
                </ul>
              </div>
            </div> <!-- END col-md-4-->
            `;

            profilesSection.innerHTML += profilesTemplate;
            // console.log('P:', profilesTemplate);
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

const ensureAdmin = () => {
  const userToken = localStorage.getItem('userToken') || undefined;
  if (userToken) {
    const role = localStorage.getItem('role');
    if (role !== 'Admin') {
      flash('alert-danger', "You can't access this page, redirecting you...");
      redirectTo('/users/home.html', true);
      return;
    }
    fetchAllProfiles();
    return;
  }
  redirectTo('../index.html', true);
};

ensureAdmin();
