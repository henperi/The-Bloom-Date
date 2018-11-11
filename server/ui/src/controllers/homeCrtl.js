getUserProfile();

const firstname = localStorage.getItem('fullname').split(' ')[0];
document.querySelector('.fullname').innerHTML = firstname;

const ensureUser = () => {
  const userToken = localStorage.getItem('userToken') || undefined;
  if (userToken) {
    const role = localStorage.getItem('role');
    if (role !== 'User') {
      flash('alert-danger', 'This page is for Users only, redirecting you...');
      redirectTo('/admin/home.html', true);
    }
    return;
  }
  redirectTo('../index.html', true);
};

ensureUser();
