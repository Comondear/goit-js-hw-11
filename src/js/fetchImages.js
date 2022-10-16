'use strict';
import axios from 'axios';
import Notiflix from 'notiflix';

const baseURL = 'https://pixabay.com/api/?key=';
const API_KEY = '30602892-abd71b62e0861d27e9591816d';
const searchOption = 'image_type=photo&orientation=horizontal&safesearch=true';

export async function fetchImages(searchQuery, HITS_PER_PAGE, currentPage) {
  try {
    const res = await axios.get(
      `${baseURL}${API_KEY}&q=${searchQuery}&${searchOption}&per_page=${HITS_PER_PAGE}&page=${currentPage}`
    );

    return await res.data;
  } catch (error) {
    Notiflix.Notify.failure(error.message);
  }
}