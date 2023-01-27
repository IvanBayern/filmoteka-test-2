// import { Movies } from './fetch';
// import { APIKey } from './apikey';





function markupMyLibrary(dataArr) {
  const markup = dataArr.map(markupCardLibrary).join('');

  refs.libraryList.insertAdjacentHTML('beforeend', markup);
}


const refs = {
  header: document.querySelector('.header'),
  modal: document.querySelector('.modal'),
  libraryList: document.querySelector('#library-list'),
  queueBtn: document.querySelector('#queue-btn'),
  watchedBtn: document.querySelector('#watched-btn'),
  subtitle: document.querySelector('.filmoteka__subtitle'),
};

refs.modal.addEventListener('click', addToQueue);

let queueFilm = [];
let queueFilmId = [];
const isMyLibMain = refs.header.classList.contains('header--mylib');
if (isMyLibMain) {
  Start();
  refs.queueBtn.addEventListener('click', addLibraryListQueue);
}

async function Start() {
  checkQueue();
}

async function addToQueue(event) {
  if (
    event.target.nodeName !== 'BUTTON' ||
    event.target.id !== 'modal__button-queue'
  ) {
    return;
  }

  const movies = new Movies(APIKey);
  checkQueue();

  if (event.target.classList[1] === 'modal__button--active') {
    event.target.textContent = 'add to Queue';
    event.target.classList.add('modal__button');
    event.target.classList.remove('modal__button--active');

    const namberFilm = queueFilmId.indexOf(
      JSON.parse(event.target.offsetParent.children[2].children[0].dataset.id)
    );

    queueFilmId.splice(namberFilm, 1);
    queueFilm.splice(namberFilm, 1);

    localStorage.setItem('queueId', JSON.stringify(queueFilmId));
    localStorage.setItem('queue', JSON.stringify(queueFilm));
    return;
  }

  if (event.target.offsetParent.children[2].children[0].dataset.id) {
    event.target.textContent = 'remove from queue';
    event.target.classList.remove('modal__button');
    event.target.classList.add('modal__button--active');
  }

  try {
    const film = await movies.getMovieDetails(
      event.target.offsetParent.children[2].children[0].dataset.id
    );
    if (!queueFilmId.includes(film.id)) {
      queueFilmId.push(film.id);
      queueFilm.push(film);

      localStorage.setItem('queueId', JSON.stringify(queueFilmId));
      localStorage.setItem('queue', JSON.stringify(queueFilm));
    }
  } catch (error) {
    console.log(error.message);
  }
}

function checkQueue() {
  if (localStorage.getItem('queue')) {
    queueFilm = JSON.parse(localStorage.getItem('queue'));
    queueFilmId = JSON.parse(localStorage.getItem('queueId'));
  }
}

export async function addLibraryListQueue() {
  try {
    refs.libraryList.innerHTML = '';
    refs.queueBtn.classList.add('button--active');
    refs.watchedBtn.classList.remove('button--active');
  } catch (error) {}

  if (!localStorage.getItem('queue')) {
    refs.subtitle.classList.remove('visually-hidden');
  }

  if (localStorage.getItem('queue')) {
    refs.subtitle.classList.add('visually-hidden');
    markupMyLibrary(queueFilm);
    if (!queueFilm.length) {
      refs.subtitle.classList.remove('visually-hidden');
    }
  }
}
