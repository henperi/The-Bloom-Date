getUserProfile();

const firstname = localStorage.getItem('fullname').split(' ')[0];
document.querySelector('.fullname').innerHTML = firstname;
