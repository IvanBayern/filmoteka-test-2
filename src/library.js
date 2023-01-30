import { getGenreNames } from './create-gallery';
import { storageKeys, buttonStates, storageHasMovie, addWatchedBtn, addQueueBtn } from './storage';

function onAddWatchedBtn(event) {
       
    addMovieToStorage(storageKeys.watched, currentMovie, addWatchedBtn);

    if(btnState.watched){
        btnState.watched = false;
        addWatchedBtn.classList.remove("active");        
        addWatchedBtn.blur();
    }
    else{
        btnState.watched = true;
        addWatchedBtn.classList.add("active");
    }

}

/** Обробка натискання "ADD TO QUEUE" */
function onAddQueueBtn(event) {

    addMovieToStorage(storageKeys.queue, currentMovie, addQueueBtn); 
    
    if(btnState.queue){
        btnState.queue = false;
        addQueueBtn.classList.remove("active");        
        addQueueBtn.blur();
    }
    else{
        btnState.queue = true;
        addQueueBtn.classList.add("active");
    }
}

/** Виконує пошук фільма в localStorage
 *  
 * @param {*} storageKey ключ сховища
 * @param {*} movieID ідентифікатор фільма
 * @return повертає true якщо фільм знайдено
 */
export function storageHasMovie(storageKey, movieID){

    let storageMoviesStr;
    try{
        storageMoviesStr = localStorage.getItem(storageKey);
        //Якщо сховище не пусте
        if(storageMoviesStr){
            let storageMoviesObj = JSON.parse(storageMoviesStr);
            
            for(let i = 0; i< storageMoviesObj.length; i++){
                if(storageMoviesObj[i].id === movieID){
                                    
                    return true;
                }
            } 
        }        
    }
    catch(error){
        console.log("storageHasMovie() error: " + error)
    }
    return false;    
}


export const storageKeys = {
    watched: "WATCHED",
    queue: "QUEUE",
};
export const buttonStates = {
    on: "REMOVE FROM",
    off: "ADD TO"
}


export function getGenreNames(genreIDs) {
  let genres;
  let parsedGenres;
  try {
    genres = localStorage.getItem(locStorage.genres);
    parsedGenres = JSON.parse(genres);
  } catch (error) {
    console.log('getGenreNames() error: ', error.message);
  }

  let genresNames = '';
  for (let i = 0; i < genreIDs.length; i++) {
    const genreID = genreIDs[i];

    if (i > 1) {
      genresNames += 'Other';
      return genresNames;
    }

    parsedGenres.map(genre => {
      if (genreID === genre.id) {
        genresNames += genre.name + ', ';
      }
    });
  }
  return genresNames.slice(0, -2);
}



/** Зберігається стан кнопок модального вікна */
export let btnState = {
  watched: false,
  queue: false,
}
export let currentMovie;

function openModal() {
  document.querySelector('.backdrop').style.display = "block";
  document.querySelector('body').style.overflowY = 'hidden';

  //Встановлення стилю кнопки "ADD TO WATCHED"
  if(storageHasMovie(storageKeys.watched, currentMovie.id)){
    addWatchedBtn.textContent = buttonStates.on + " " + storageKeys.watched;
    addWatchedBtn.classList.add("active");
    btnState.watched = true;
  }
  else{
    addWatchedBtn.textContent = buttonStates.off + " " + storageKeys.watched;
    addWatchedBtn.classList.remove("active");
    btnState.watched = false;
  }

  //Встановлення стилю кнопки "ADD TO QUEUE"
  if(storageHasMovie(storageKeys.queue, currentMovie.id)){
    addQueueBtn.textContent = buttonStates.on + " " + storageKeys.queue;
    addQueueBtn.classList.add("active");
    btnState.queue = true;
  }
  else{
    addQueueBtn.textContent = buttonStates.off + " " + storageKeys.queue;
    addQueueBtn.classList.remove("active");
    btnState.queue = false;
  }
}

function closeModal() {
  document.querySelector('.backdrop').style.display = "none";
  document.querySelector('body').style.overflowY = 'visible';
}

document.querySelector('.modal__close').addEventListener("click", closeModal);
document.querySelector('.gallery').addEventListener("click", function(e) {
  let targetItem = e.target;
  if (targetItem.closest('.card')){
    const movieId = targetItem.closest('.card').getAttribute('movie-id');
    const data = JSON.parse(localStorage.getItem('movieData'));

    const movie = data.find((item)=> {
      if (Number(movieId) === item.id) {
        return true;
      }
    })
    currentMovie = movie;

    document.querySelector('.content-card__img>img').setAttribute('src', 'https://image.tmdb.org/t/p/w500' + movie.poster_path);
    document.querySelector('.content-card__title').innerText = movie.title;
    document.querySelector('.content-card__about-text').innerText = movie.overview;

    document.querySelector('.modal__movie-bord').innerText = movie.vote_average.toFixed(1);
    document.querySelector('.modal__movie-number').innerText = movie.vote_count;
    document.querySelector('.modal__movie-popularity').innerText = movie.popularity.toFixed(1);
    document.querySelector('.modal__movie-original').innerText = movie.original_title;
    document.querySelector('.modal__movie-genres').innerText = getGenreNames(movie.genre_ids);

    openModal();
  }
});





 import {
  storageKeys,
  buttonStates,
  storageHasMovie,
  addWatchedBtn,
  addQueueBtn,
} from './storage';
// import { setMarkup } from './create-gallery';
import getGenreNames from './create-gallery';

// import Pagination from 'tui-pagination';
// import { paginationOptions } from './projectOptions';

import './modal-login';

console.log('START');

const refs = {
  btnWatched: document.querySelector('.watched'),
  btnQueue: document.querySelector('.queue'),
  libraryGallery: document.querySelector('.gallery'),
  loader: document.querySelector('.loader'),
  noItemsImg: document.querySelector('.library__no-items'),
};
refs.loader.classList.add('is-hidden');

export let currentState = 'empty';
export let watchedMovies = '';
export let queueMovies = '';

// ============================
// Генерация галереи при первом старте
if (localStorage.getItem('WATCHED')) {
  watchedMovies = JSON.parse(localStorage.getItem('WATCHED'));
  console.log('watchedMovies :>> ', watchedMovies.length);

  if (!!watchedMovies.length) {
    currentState = 'watched';
    refs.loader.classList.add('is-hidden');
    createGalleryMarkup(watchedMovies);
    refs.btnQueue.classList.remove('library-header__button--active');
    refs.btnWatched.classList.add('library-header__button--active');
  }
}
if (localStorage.getItem('QUEUE')) {
  queueMovies = JSON.parse(localStorage.getItem('QUEUE'));
  if (!!queueMovies.length) {
    // refs.btnWatched.disabled = true;
    currentState = 'queue';
    refs.loader.classList.add('is-hidden');
    createGalleryMarkup(queueMovies);
    refs.btnWatched.classList.remove('library-header__button--active');
    refs.btnQueue.classList.add('library-header__button--active');
  }
}
if (currentState === 'empty') {
  refs.btnQueue.disabled = true;
  refs.btnWatched.disabled = true;
  refs.noItemsImg.style.display = 'block';
}
// ================================
function refreshLibrary() {
  switch (currentState) {
    case 'watched':
      watchedMovies = JSON.parse(localStorage.getItem('WATCHED'));
      createGalleryMarkup(watchedMovies);
      break;

    case 'queue':
      queueMovies = JSON.parse(localStorage.getItem('QUEUE'));
      createGalleryMarkup(queueMovies);
      break;
  }
}
// if (refs.btnQueue.disabled && refs.btnWatched.disabled) {
//   refs.noItemsImg.style.display = 'block';
// }

// =====================================================================================

refs.btnWatched.addEventListener('click', onWatchedButtonClick);
refs.btnQueue.addEventListener('click', onQueueButtonClick);

// =====================================

function onWatchedButtonClick(event) {
  event.preventDefault();
  console.log(event);
  if (event.target.classList.contains('watched')) {
    refs.btnQueue.classList.remove('library-header__button--active');
    refs.btnWatched.classList.add('library-header__button--active');
  }
  currentState = 'watched';

 
  console.log('watchedMovies :>> ', watchedMovies);
  const cardsPerPade = 10;
  const totalCards = watchedMovies.length;
  const totalPages = Math.ceil(totalCards / cardsPerPade);
  console.log('totalPages :>> ', totalPages);

  

  createGalleryMarkup(watchedMovies);

  //
  //--------------------------------------

  refs.loader.classList.add('is-hidden');
}

function onQueueButtonClick(event) {
  // console.log('QQQQQ');
  event.preventDefault();
  if (event.target.classList.contains('queue')) {
    refs.btnWatched.classList.remove('library-header__button--active');
    refs.btnQueue.classList.add('library-header__button--active');
  }
  currentState = 'queue';
  createGalleryMarkup(queueMovies);
  refs.loader.classList.add('is-hidden');
}

function closeModal() {
  document.querySelector('.backdrop').style.display = 'none';
  document.querySelector('body').style.overflowY = 'visible';
  console.log('currentState при закрытии модалки->', currentState);
  refreshLibrary();
}

document.querySelector('.modal__close').addEventListener('click', closeModal);

CURRENTSTATE = currentState.toUpperCase();
console.log('currentState==', CURRENTSTATE);
// ========================================
// открытие модалки
document.querySelector('.gallery').addEventListener('click', function (e) {
  let targetItem = e.target;
  if (targetItem.closest('.card')) {
    const movieId = targetItem.closest('.card').getAttribute('movie-id');
    const data = JSON.parse(localStorage.getItem(CURRENTSTATE));
    const movie = data.find(item => {
      if (Number(movieId) === item.id) {
        return true;
      }
    });
    currentMovie = movie;

    document
      .querySelector('.content-card__img>img')
      .setAttribute(
        'src',
        'https://image.tmdb.org/t/p/w500' + movie.poster_path
      );
    document.querySelector('.content-card__title').innerText = movie.title;
    document.querySelector('.content-card__about-text').innerText =
      movie.overview;

    document.querySelector('.modal__movie-bord').innerText =
      movie.vote_average.toFixed(1);
    document.querySelector('.modal__movie-number').innerText = movie.vote_count;
    document.querySelector('.modal__movie-popularity').innerText =
      movie.popularity.toFixed(1);
    document.querySelector('.modal__movie-original').innerText =
      movie.original_title;
    document.querySelector('.modal__movie-genres').innerText = getGenreNames(
      movie.genre_ids
    );

    openModal();
  }
});

// открытие модалки
// =====================================
function openModal() {
  document.querySelector('.backdrop').style.display = 'block';
  document.querySelector('body').style.overflowY = 'hidden';

  //Встановлення тексту кнопки "ADD TO WATCHED"
  if (storageHasMovie(storageKeys.watched, currentMovie.id)) {
    addWatchedBtn.textContent = buttonStates.on + ' ' + storageKeys.watched;
  } else {
    addWatchedBtn.textContent = buttonStates.off + ' ' + storageKeys.watched;
  }

  //Встановлення тексту кнопки "ADD TO QUEUE"
  if (storageHasMovie(storageKeys.queue, currentMovie.id)) {
    addQueueBtn.textContent = buttonStates.on + ' ' + storageKeys.queue;
  } else {
    addQueueBtn.textContent = buttonStates.off + ' ' + storageKeys.queue;
  }
}
// ==============================
//закриття модалки по кліку поза модалки
window.addEventListener('click', function (event) {
  if (event.target === document.querySelector('.backdrop')) {
    closeModal();
  }
});


export default function onButtonWatchedClick() {
  const movie = {
    id: document.querySelector('.content-card__title').dataset.id,
    poster_path: document.querySelector('.content-card__img').src,
    title: document.querySelector('.content-card__title').textContent,
    genre: document.querySelector('.genre-modal').textContent,
    year: document.querySelector('.content-card__title').dataset.year,
    votes: document.querySelector('.content-card__vote').textContent,
  };
  // если вообще пустое хранилище, пишем
  if (localStorage.getItem('watched') === null) {
    localStorage.setItem('watched', JSON.stringify([movie]));
    return;
  }
  //   проверка нет ли такого уже в хранилище
  //  =========== может вынести в глобал??? Вынес!
  const moviesFromStorage = localStorage.getItem('watched');
  let watchedMovies = JSON.parse(moviesFromStorage);
  // ================
  if (watchedMovies.find(item => item.id === movie.id)) {
    alert(`Oops! The movie has already been added`);
    return;
  }

  //   а если нету в хранилище, добавляем
  else {
    watchedMovies.push(movie);
    localStorage.setItem('watched', JSON.stringify(watchedMovies));
  }
}
