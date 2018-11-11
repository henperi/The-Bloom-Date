'use strict';

/**
 * Event to fire as the page sets up
 */
// window.addEventListener('load', () => {
//   document.querySelector('.setup-page').classList.remove('hide');
//   setInterval(() => {
//     document.querySelector('.setup-page').classList.add('hide');
//     document.querySelector('.container').classList.remove('hide');
//   }, 2000);
// });

/**
 * Toggle Items on the dom
 */
var toggler = function toggler(event) {
  if (event.target.classList.contains('triggerModal')) {
    var targetModal = event.srcElement.getAttribute('data-target');
    document.getElementById('#' + targetModal).classList.toggle('show-modal');
    // console.log(targetModal);
  }
  if (event.target.classList.contains('close-button')) {
    var modalToClose = event.target.offsetParent.offsetParent.getAttribute('id');
    document.getElementById(modalToClose).classList.remove('show-modal');
    document.querySelector('.otherTribe').innerHTML = TRIBE || 'Other';
  }
  if (event.target.classList.contains('custom-modal')) {
    event.target.classList.toggle('show-modal');
  }
};

// Add an event listener to the dom to listen for certain types of events
window.addEventListener('click', toggler);

// const tribeOther = document.querySelector('.tribe-other');
// tribeOther.addEventListener('keyup', () => {
//   console.log(tribeOther.value);
// });