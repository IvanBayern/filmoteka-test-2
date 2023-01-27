let watchedFilm = [];
let watchedFilmId = [];
async function checkWatched() {
  if (localStorage.getItem('watched')) {
    watchedFilm = JSON.parse(localStorage.getItem('watched'));
    watchedFilmId = JSON.parse(localStorage.getItem('watchedId'));
  }
}

export default async function createBtnWatched(id) {
  checkWatched();

  const modalWatchedBtn = document.querySelector('#modal__watched-button');
  if (watchedFilmId.includes(id)) {
    modalWatchedBtn.textContent = 'remove Watched';
    modalWatchedBtn.classList.remove('modal__button');
    modalWatchedBtn.classList.add('modal__button--active');
    return;
  } else {
    modalWatchedBtn.textContent = 'add to Watched';
    modalWatchedBtn.classList.add('modal__button');
    modalWatchedBtn.classList.remove('modal__button--active');
    return;
  }
}
