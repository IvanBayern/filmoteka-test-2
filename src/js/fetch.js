const axios = require('axios').default;

export class Movies {
  constructor(APIKey) {
    this.APIKey = APIKey;

    // Если отправили запрос, но ещё не получили ответ,
    // не нужно отправлять ещё один запрос:
    this.isLoading = false;
  }

  getTrendingMovies(page = 1) {
    const URI = `https://api.themoviedb.org/3/trending/movie/day?api_key=${this.APIKey}&page=${page}`;

    return this.fetchMovies(URI);
  }
  

  searchMovies(query, page = 1) {
    const URI = `https://api.themoviedb.org/3/search/movie?api_key=${this.APIKey}&query=${query}&page=${page}`;

    return this.fetchMovies(URI);
  }

  getMovieDetails(movie_id) {
    const URI = `https://api.themoviedb.org/3/movie/${movie_id}?api_key=${this.APIKey}`;

    return this.fetchMovies(URI);
  }

  getMovieTrailers(movie_id) {
    const URI = `https://api.themoviedb.org/3/movie/${movie_id}/videos?api_key=${this.APIKey}`;

    return this.fetchMovies(URI);
  }

  async fetchMovies(URI) {
    if (this.isLoading) return;

    this.isLoading = true;
    const response = await axios.get(URI);
    this.isLoading = false;

    return response.data;
  }

  getGenres() {
    const URI = `https://api.themoviedb.org/3/genre/movie/list?api_key=${this.APIKey}`;
    return this.fetchGenres(URI);
  }

  async fetchGenres(URI) {
    const response = await axios.get(URI);
    return response.data.genres;
  }
}
