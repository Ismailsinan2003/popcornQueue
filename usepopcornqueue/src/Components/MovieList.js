import Movies from "./Movies";

export default function MovieList({ movies, onMovieClick }) {
  return (
    <ul>
      {movies.map((movie) => (
        <Movies movie={movie} key={movie.imdbID} onMovieClick={onMovieClick} />
      ))}
    </ul>
  );
}
