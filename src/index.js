'use strict';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from './js/fetchImages';

const refs = {
  searchForm: document.querySelector('.search-form'),
  buttonForm: document.querySelector('.button-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
  input: document.querySelector('.input-form')
};

const { searchQuery } = refs.searchForm;


const lightBox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

const HITS_PER_PAGE = 20;
let items = [];
let query = '';
let currentPage = 1;
let totalPages = 0;

// ---  Fetching data from array of images---
async function fetchData() {
  const data = await fetchImages(query, HITS_PER_PAGE, currentPage);
  items = await [...items, data.hits];
  totalPages = await data.totalHits;
  renderList(data.hits);

  if (currentPage === 1 && data.total > 0) {
    return Notiflix.Notify.success(`Hooray! We found  ${data.total} images`, {
      position: 'center-center',
    });
  }

  if (data.hits.length === 0) {

    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      {
        position: 'center-center',
      }
    );
    // target = null;
    // controller.abort();
    refs.loadMore.classList.add('hidden');
    return;
  }

  if (currentPage > Number(totalPages / HITS_PER_PAGE)) {
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results.",
      {
        position: 'center-center',
      }
    );
    refs.loadMore.classList.add('hidden');
    return;
  }
}




const handleSubmit = async event => {
  event.preventDefault();
  if (query === searchQuery.value) return;

  query = await searchQuery.value;
  refs.gallery.innerHTML = '';
  currentPage = 1;
  items = [];

  if (!query) return;
  fetchData();
};

refs.searchForm.addEventListener('submit', handleSubmit);

function renderList(itemsData) {
  refs.gallery.insertAdjacentHTML('beforeend', createMarkup(itemsData));
  const target = document.querySelector('.photo-card:last-child');
  observer.observe(target);
  lightBox.refresh();
  refs.input.value = '';
  refs.loadMore.classList.remove('hidden');
}

function createMarkup(items) {
  return items
    .map(item => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = item;
      return `
      <div class="photo-card">
            <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
            <div class="info">
                <p class="info-item">
                    <b>Likes</b> ${likes}
                </p>
                <p class="info-item">
                    <b>Views</b> ${views}
                </p>
                <p class="info-item">
                    <b>Comments</b> ${comments}
                </p>
                <p class="info-item">
                    <b>Downloads</b> ${downloads}
                </p>
            </div>
        </div>
      `;
    })
    .join(' ');
}

const observer = new IntersectionObserver(
  ([entry], observer) => {
    // проверяем что достигли последнего элемента
    if (entry.isIntersecting) {
      // перестаем его отслеживать
      observer.unobserve(entry.target);
      // и загружаем новую порцию контента
      currentPage++;
      fetchData();
    }
  },
  { threshold: 0.5 }
);

// let controller = new AbortController(observer);

//////////////////////////////////////////////////


// refs.loadMore.addEventListener('click', loadMoreClick);

// function loadMoreClick() {
//   currentPage += 1;
//   fetchData();

//   refs.loadMore.classList.add('hidden');
// }

////////////////////////////////////

// window.addEventListener('scroll', () => {
//   const documentRect = document.documentElement.getBoundingClientRect();
//   if (documentRect.bottom < document.documentElement.clientHeight + 150) {
//     currentPage += 1;
//     fetchData();
//   }
// });

