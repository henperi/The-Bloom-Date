'use strict';

getAdminProfile();

var firstname = localStorage.getItem('fullname').split(' ')[0];
// document.querySelector('.fullname').innerHTML = firstname;

/**
 * Get The Authenticated User Profile
 */
var fetchAllProfiles = function fetchAllProfiles() {
  var userToken = localStorage.getItem('userToken') || undefined;
  if (userToken) {
    var fetchAllProfilesUrl = localAPI + '/users/fetchAllProfiles';

    fetch(fetchAllProfilesUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json;charset=UTF-8',
        'x-access-token': userToken
      }
    }).then(function (res) {
      return res.json();
    }).then(function (data) {
      // console.log('data:', data);
      // Profile was not found
      if (!data.success) {
        // Render the no profile found message
        document.querySelector('.users-count').innerHTML = 'No Registered Users Yet';
      }

      // Profile fetched
      if (data.success) {
        // Render the User profiles
        var profile = data.data;

        var profilesSection = document.querySelector('.profiles-section');
        document.querySelector('.users-count').innerHTML = 'Registered Users (' + profile.length + ')';
        profilesSection.innerHTML = '';
        for (var i = 0; i < profile.length; i += 1) {
          var profilesTemplate = '\n            <div class="col-md-4 mt-4">\n              <div class="bg-white box-shadow-v2 rounded py-5">\n              <img src="/assets/img/svg/phone-book.svg" class="u-h-90" alt="">\n                <h4 class="u-mb-35 u-mt-15">\n                  ' + profile[i].fullname + '\n                </h4>\n                <hr class="m-0">\n                <ul class="list-unstyled u-py-30 u-lh-2">\n                <li><strong>State</strong> ' + profile[i].state + '</li>\n                <li><strong>Residence</strong> ' + profile[i].residence + '</li>\n                <li><strong>Tribe</strong> ' + profile[i].tribe + '</li>\n                <li><strong>Gender</strong> ' + profile[i].gender + '</li>\n                  <li><strong>Birthday</strong> ' + profile[i].birthday + '</li>\n                </ul>\n              </div>\n            </div> <!-- END col-md-4-->\n            ';

          profilesSection.innerHTML += profilesTemplate;
          // console.log('P:', profilesTemplate);
        }
      }
    }).catch(function (error) {
      console.log(error);
      loader.classList.add('hide');
      responseArea.innerHTML = '\n        <li class="list-group-item text-danger">\n          A connection error occurred, try again in a moment\n        </li>';
    });
  }
  if (!userToken) {
    localStorage.clear();
    flash('alert-danger', 'You need to login to access this page');
    setFlash('alert-danger', 'You need to login to access this page');
    redirectTo('../login.html');
  }
};

var ensureAdmin = function ensureAdmin() {
  var userToken = localStorage.getItem('userToken') || undefined;
  if (userToken) {
    var role = localStorage.getItem('role');
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