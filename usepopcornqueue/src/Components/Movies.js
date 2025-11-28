export default function Movies({ movie, onMovieClick }) {
  return (
    <>
      <li onClick={() => onMovieClick(movie.imdbID)}>
        <img
          className="movie-img"
          src={movie.Poster}
          alt={movie.Title}
          height="100px"
          width="70px"
        />
        <h5>{movie.Title}</h5>
        <p>
          <img
            className="search-logo"
            src="ReleaseYear.svg"
            alt="releaseDate"
          />
          {movie.Year}
        </p>
      </li>
    </>
  );
}
