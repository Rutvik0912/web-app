import React, { useEffect, useState } from 'react';
import { fetchMovies, fetchPopularMovies, fetchGenres } from '../services/movieService';
import MovieList from '../components/MovieList';
import InfiniteScroll from 'react-infinite-scroll-component';
import { TextField, Select, MenuItem, InputLabel, FormControl, Grid, Typography, Button } from '@mui/material';

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [favorites, setFavorites] = useState([]);
    const [genres, setGenres] = useState([]);
    const [filters, setFilters] = useState({
        releaseYearFrom: '',
        releaseYearTo: '',
        ratingFrom: '',
        ratingTo: '',
        genre: ''
    });
    const [showFavorites, setShowFavorites] = useState(false);

    useEffect(() => {
        const loadMovies = async () => {
            const data = query ? await fetchMovies(query, page, filters) : await fetchPopularMovies(page, filters);
            setMovies(prevMovies => (page === 1 ? data.results : [...prevMovies, ...data.results]));
            setHasMore(data.page < data.total_pages);
        };
        if (!showFavorites) { // Fetch movies only if not showing favorites
            loadMovies();
        }
    }, [page, query, filters, showFavorites]);

    useEffect(() => {
        const loadGenres = async () => {
            const data = await fetchGenres();
            setGenres(data);
        };
        loadGenres();
    }, []);

    const fetchMoreMovies = () => {
        setPage(prevPage => prevPage + 1);
    };

    const handleSearch = event => {
        setQuery(event.target.value);
        setPage(1);
        setMovies([]);
        setHasMore(true);
    };

    const handleFavorite = (updatedFavorites) => {
        setFavorites(updatedFavorites);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    };

    const handleFilterChange = event => {
        const { name, value } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
        setPage(1);
        setMovies([]);
        setHasMore(true);
    };

    useEffect(() => {
        const savedFavorites = JSON.parse(localStorage.getItem('favorites'));
        if (savedFavorites) {
            setFavorites(savedFavorites);
        }
    }, []);

    const handleResetFilters = () => {
        setFilters({
            releaseYearFrom: '',
            releaseYearTo: '',
            ratingFrom: '',
            ratingTo: '',
            genre: ''
        });
        setPage(1);
        setMovies([]);
        setHasMore(true);
    };

    const toggleShowFavorites = () => {
        setShowFavorites(prevState => !prevState);
    };

    return (
        <Grid container direction="column" alignItems="center" spacing={2}>
            <Grid item xs={12}>
                <Button variant="contained" color="secondary" onClick={toggleShowFavorites} style={{margin: "1rem"}}>
                    {showFavorites ? 'Show All Movies' : 'Show Favorites'}
                </Button>
            </Grid>
            {showFavorites ? (
                <Grid item xs={12}>
                    <Typography variant="h4" align="center">Favorites</Typography>
                    <MovieList movies={favorites} favorites={favorites} onFavorite={handleFavorite} />
                </Grid>
            ) : (
                <>
                    <Typography variant="h4" align="center">Featured</Typography>
                    <Grid item>
                        <TextField
                            type="text"
                            placeholder="Search for movies..."
                            value={query}
                            onChange={handleSearch}
                            className="search-input"
                        />
                    </Grid>
                    <Grid item container spacing={2} alignItems="center" justifyContent="center">
                        <Grid item>
                            <FormControl style={{width: "10rem"}}>
                                <InputLabel id="genre-label">Genre</InputLabel>
                                <Select
                                    labelId="genre-label"
                                    value={filters.genre}
                                    name="genre"
                                    onChange={handleFilterChange}
                                >
                                    <MenuItem value="">All Genres</MenuItem>
                                    {genres.map(genre => (
                                        <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item>
                            <TextField
                                type="number"
                                name="releaseYearFrom"
                                label="From Year"
                                value={filters.releaseYearFrom}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                type="number"
                                name="releaseYearTo"
                                label="To Year"
                                value={filters.releaseYearTo}
                                onChange={handleFilterChange}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                type="number"
                                name="ratingFrom"
                                label="From Rating"
                                value={filters.ratingFrom}
                                onChange={handleFilterChange}
                                inputProps={{ min: 0, max: 10 }}
                                style={{width: "10rem"}}
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                type="number"
                                name="ratingTo"
                                label="To Rating"
                                value={filters.ratingTo}
                                onChange={handleFilterChange}
                                inputProps={{ min: 0, max: 10 }}
                                style={{width: "10rem"}}
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={handleResetFilters}>
                                Reset Filters
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <InfiniteScroll
                            dataLength={movies.length}
                            next={fetchMoreMovies}
                            hasMore={hasMore}
                            loader={<Typography variant="h6" align="center">Loading...</Typography>}
                        >
                            <MovieList movies={movies} favorites={favorites} onFavorite={handleFavorite} />
                        </InfiniteScroll>
                    </Grid>
                </>
            )}
        </Grid>
    );
};

export default HomePage;