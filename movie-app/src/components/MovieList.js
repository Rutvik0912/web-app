import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'; // Import unfilled favorite icon

const MovieList = ({ movies, favorites, onFavorite }) => {
  const isFavorite = (movie) => favorites?.some(fav => fav.id === movie.id);

  const toggleFavorite = (movie) => {
    const isAlreadyFavorite = isFavorite(movie);
    if (isAlreadyFavorite) {
      const updatedFavorites = favorites.filter(fav => fav.id !== movie.id);
      onFavorite(updatedFavorites);
    } else {
      onFavorite([...favorites, movie]);
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {movies.map(movie => (
        <Card key={movie.id} style={{ margin: '10px', width: '300px' }}>
          <CardActionArea>
            <CardMedia
              component="img"
              height="400"
              image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <CardContent>
              <Typography variant="h6" component="div" gutterBottom>
                {movie.title} ({movie.release_date && movie.release_date.substring(0, 4)})
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {movie.overview}
              </Typography>
            </CardContent>
          </CardActionArea>
          <IconButton onClick={() => toggleFavorite(movie)}>
            {isFavorite(movie) ? <FavoriteIcon color="primary" /> : <FavoriteBorderIcon color="primary" />}
          </IconButton>
        </Card>
      ))}
    </div>
  );
};

export default MovieList;