'use strict';

getUserProfile();

var firstname = localStorage.getItem('fullname').split(' ')[0];
document.querySelector('.fullname').innerHTML = firstname;