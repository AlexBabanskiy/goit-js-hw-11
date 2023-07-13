// const BAS_URL = 'https://pixabay.com/api/';
// const API_KEY = '38201133-05c491ba09fd74adbeede06bd';

// fetch(
//   `${BAS_URL}?key=${API_KEY}&orientation=horizontal&q=yellow+flowers&image_type=photo`
// )
//   .then(response => {
//     return response.json();
//   })
//   .then(images => console.log(images));

import NewsApiService from './js/api-service';
import SimpleLightbox from 'simplelightbox';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

// Додатковий імпорт стилів
import 'simplelightbox/dist/simple-lightbox.min.css';

const newsApiService = new NewsApiService();

const refs = {
  searchForm: document.querySelector('.search-form'),
  // articlesContainer: document.querySelector('article-list'),
  loadMoreBtn: document.querySelector('[data-action="load-more"]'),
};

// console.log(refs.searchForm);
// console.log(refs.loadMoreBtn);

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

refs.loadMoreBtn.style.display = 'none';

const perPage = 40;

const gallery = document.querySelector('.gallery');

const slider = [
  {
    modalImg: new SimpleLightbox('.gallery a', {
      doubleTapZoom: '1.5',
      captionsData: 'data-parent',
      captionDelay: 250,
      widthRatio: 1.5,
    }),
  },
];

async function generateMarkup(images) {
  if (!gallery) {
    console.error('Container element not found');
    return;
  }

  let markup = '';

  await images.forEach(image => {
    markup += `<div class="photo-card"> <a class="card-item" href="${image.largeImageURL}">
<img class='card-img' src="${image.webformatURL}" alt="${image.tag}" loading="lazy" /></a>
<div class="info">
  <p class="info-item">
    <b>Likes:</b> ${image.likes}
  </p>
  <p class="info-item">
    <b>Views:</b> ${image.views}
  </p>
  <p class="info-item">
    <b>Comments:</b> ${image.comments}
  </p>
  <p class="info-item">
    <b>Downloads:</b> ${image.downloads}
  </p>
</div>
</div>`;
  });

  gallery.insertAdjacentHTML('beforeend', markup);

  const imgSlider = slider[0].modalImg;
  imgSlider.refresh();
}

async function onSearch(e) {
  e.preventDefault();

  const input = e.target.querySelector('input');

  newsApiService.query = input.value;

  // console.log(newsApiService.query);
  // console.log(images);

  newsApiService.resetPage();

  await newsApiService.fetchArticles().then(images => {
    if (newsApiService.query === '') {
      return Notify.failure('You need enter your query!');
    } else {
      Notify.success(`Hooray! We found ${images.totalHits} images`);
    }

    if (images.totalHits === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      clearArticlesContainer();
      generateMarkup(images.hits);
      refs.loadMoreBtn.style.display = 'block';
    }
  });
}

async function onLoadMore() {
  let pageCounter = 1;
  pageCounter += 1;

  await newsApiService.fetchArticles().then(images => {
    generateMarkup(images.hits);
    let pagesCount = Math.ceil(images.totalHits / perPage);
    console.log(pagesCount);
    if (pagesCount === pageCounter) {
      Notify.failure(
        `We're sorry, but you've reached the end of search results.`
      );
      refs.loadMoreBtn.style.display = 'none';
    }
  });
}

function clearArticlesContainer(images) {
  gallery.innerHTML = '';
}
