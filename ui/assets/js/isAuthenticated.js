const userToken = localStorage.getItem('userToken');
if (userToken) {
  responseArea.innerHTML = '<span class="list-group-item text-success">You already have an account, complete your profile</span>';
  setInterval(() => {
    window.location.href = `${host}/ui/set-up-profile.html`;
  }, 1000);
}
