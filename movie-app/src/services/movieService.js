import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (query, page = 1, filters = {}) => {
  console.log('Fetch Movies API Request:', { query, page, filters });
  const response = await axios.get(`${BASE_URL}/search/movie`, {
    params: {
      api_key: API_KEY,
      query,
      page,
      ...filters,
      with_genres: filters.genre
    },
  });
  console.log('Fetch Movies API Response:', response.data);
  return response.data;
};

export const fetchPopularMovies = async (page = 1, filters = {}) => {
  console.log('Fetch Popular Movies API Request:', { page, filters });
  const response = await axios.get(`${BASE_URL}/movie/popular`, {
    params: {
      api_key: API_KEY,
      page,
      ...filters,
      with_genres: filters.genre
    },
  });
  console.log('Fetch Popular Movies API Response:', response.data);
  return response.data;
};

export const fetchGenres = async () => {
  const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
    params: {
      api_key: API_KEY,
    },
  });
  return response.data.genres;
};