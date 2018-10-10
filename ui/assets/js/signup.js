const next = document.querySelector('#next');
const back = document.querySelector('#back');

const first = document.querySelector('#first');
const second = document.querySelector('#second');
const third = document.querySelector('#third');
// const fixed = document.querySelector('#fixed');
const finish = document.querySelector('#finish');

let current = 1;
back.classList.add('hide');
const goToNext = () => {
  if (current < 3) {
    if (current === 1) {
      first.classList.add('hide');
      back.classList.remove('hide');
      second.classList.remove('hide');
    }
    if (current === 2) {
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
