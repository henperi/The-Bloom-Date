const userToken = localStorage.getItem('userToken');
if (userToken) {
  alert('You are logged in');
  responseArea.innerHTML = '<span class="text-success">You already have an account, complete your profile</span>';
  setInterval(() => {
    window.location.href = `${host}/ui/set-up-profile.html`;
  }, 1000);
}
