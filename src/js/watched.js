import { Movies } from './fetch';
import { APIKey } from './apikey';
import refs from './refs';


function markupMyLibrary(dataArr) {
  const markup = dataArr.map(markupCardLibrary).join('');

  refs.libraryList.insertAdjacentHTML('beforeend', markup);
}

const refs = {
  header: document.querySelector('.header'),
  libraryList: document.querySelector('#library-list'),
  filmotekaList: document.querySelector('#filmoteka-list'),
  filmotekaItem: document.querySelector('.filmoteka__item'),
  watchedBtn: document.querySelector('#watched-btn'),
  myLibLink: document.querySelector('#mylib-link'),
  queueBtn: document.querySelector('#queue-btn'),
  modalCard: document.querySelector('.modal'),
  modalContent: document.querySelector('.modal__content'),
  modalCloseBtn: document.querySelector('.modal__close-btn'),
  subtitle: document.querySelector('.filmoteka__subtitle'),
};



try {
  refs.modalCard.addEventListener('click', addWatched);
} catch (error) {}

let watchedFilm = [];
let watchedFilmId = [];
const isMyLibMain = refs.header.classList.contains('header--mylib');
if (isMyLibMain) {
  createWatched();

  try {
    refs.watchedBtn.addEventListener('click', addLibraryListWatched);
  } catch (error) {}
}

async function createWatched() {
  checkWatched();

  await addLibraryListWatched();
}

//  Витяг з LocalStorage
function checkWatched() {
  if (localStorage.getItem('watched')) {
    watchedFilm = JSON.parse(localStorage.getItem('watched'));
    watchedFilmId = JSON.parse(localStorage.getItem('watchedId'));
    
  }
  
}

// Запис в LocalStorage
async function addWatched(event) {
  if (
    event.target.nodeName !== 'BUTTON' ||
    event.target.id !== 'modal__watched-button'
  ) {
    return;
  }
  const movies = new Movies(APIKey);
  checkWatched();

  if (event.target.classList[1] === 'modal__button--active') {
    event.target.textContent = 'add to Watched';
    event.target.classList.add('modal__button');
    event.target.classList.remove('modal__button--active');

    const namberFilm = watchedFilmId.indexOf(
      JSON.parse(event.target.offsetParent.children[2].children[0].dataset.id)
    );

    watchedFilmId.splice(namberFilm, 1);
    watchedFilm.splice(namberFilm, 1);

    localStorage.setItem('watchedId', JSON.stringify(watchedFilmId));
    localStorage.setItem('watched', JSON.stringify(watchedFilm));
    return;
  }

  if (event.target.offsetParent.children[2].children[0].dataset.id) {
    event.target.textContent = 'remove Watched';
    event.target.classList.remove('modal__button');
    event.target.classList.add('modal__button--active');
  }

  try {
    const film = await movies.getMovieDetails(
      event.target.offsetParent.children[2].children[0].dataset.id
    );
    if (!watchedFilmId.includes(film.id)) {
      watchedFilmId.push(film.id);
      watchedFilm.push(film);

      localStorage.setItem('watchedId', JSON.stringify(watchedFilmId));
      localStorage.setItem('watched', JSON.stringify(watchedFilm));
    }
  } catch (error) {
    console.log(error.message);
  }
}

// Створення контенту My library watched
export async function addLibraryListWatched() {
  try {
    refs.libraryList.innerHTML = '';
    refs.watchedBtn.classList.add('button--active');
    refs.queueBtn.classList.remove('button--active');
  } catch (error) {}

  if (!localStorage.getItem('watched')) {
    refs.subtitle.classList.remove('visually-hidden');
  }

  if (localStorage.getItem('watched')) {
    refs.subtitle.classList.add('visually-hidden');
    markupMyLibrary(watchedFilm);
    if (!watchedFilm.length) {
      console.log('watchedFilm ', watchedFilm.length);
      refs.subtitle.classList.remove('visually-hidden');
      console.log('refs.subtitle ', refs.subtitle);
      // return;
    }
  }
}
