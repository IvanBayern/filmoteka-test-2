let queueFilm = [];
let queueFilmId = [];
async function checkQueue() {
  if (localStorage.getItem('queue')) {
    queueFilm = JSON.parse(localStorage.getItem('queue'));
    queueFilmId = JSON.parse(localStorage.getItem('queueId'));
  }
}

export default async function createBtnQueue(id) {
  checkQueue();

  const modalQueueBtn = document.querySelector('#modal__button-queue');
  if (queueFilmId.includes(id)) {
    modalQueueBtn.textContent = 'remove from queue';
    modalQueueBtn.classList.remove('modal__button');
    modalQueueBtn.classList.add('modal__button--active');
    return;
  } else {
    modalQueueBtn.textContent = 'add to Queue';
    modalQueueBtn.classList.add('modal__button');
    modalQueueBtn.classList.remove('modal__button--active');
    return;
  }
}
