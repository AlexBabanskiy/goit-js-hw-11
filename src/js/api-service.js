const BAS_URL = 'https://pixabay.com/api/';
const API_KEY = '38222866-76ec0a8e3ce90551c34c0756b';
import axios from 'axios';

export default class NewsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async fetchArticles() {
    const url = `${BAS_URL}?key=${API_KEY}&orientation=horizontal&q=${this.searchQuery}&image_type=photo&page=${this.page}&safesearch=true&per_page=40`;

    const options = {
      headers: {
        Authorization: API_KEY,
      },
    };

    try {
      const data = await axios.get(url);
      // console.log(data.data);
      this.incrementPage();
      return data.data;
    } catch (error) {
      console.log(error.message);
      Notify.failure(`Error is ${error.message}`);
    }
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
