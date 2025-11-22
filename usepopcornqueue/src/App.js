import { useEffect, useState } from "react";
import "./index.css";
import "./queries.css";

// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const KEY = "608e27e7";

export default function App() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    function () {
      async function fetchMovies() {
        setIsLoading(true);
        setError("");
        try {
          const res = await fetch(
            `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}
          `
          );
          console.log(res);

          if (!res.ok)
            throw new Error("something went wrong in fetching the movie");

          const data = await res.json();
          console.log(data);

          if (data.Response === "False") throw new Error("Movie not Found");
          setMovies(data.Search);
        } catch (err) {
          const message = err?.message || "Movie not found";
          console.error(message);
          setError(message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 2) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies();
    },
    [query]
  );

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <Numresult movies={movies} />
      </Navbar>

      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && <MovieList movies={movies} />}
          {error && <Error message={error} />}
        </Box>
        <Box>
          <WatchedSummary />
          <WatchedMovieList watchedMovie={watched} />
        </Box>
      </Main>
    </>
  );
}

function Navbar({ children }) {
  return <nav className="navbar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <img src="popcornQueue-logo.svg" alt="logo" />
      <h4 className="logo-text">popcornQueue</h4>
    </div>
  );
}

function Search({ query, setQuery }) {
  return (
    <input
      type="text"
      placeholder="Search Movies..."
      className="search"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}

function Numresult({ movies }) {
  return <p className="numResult">Found {movies.length} results</p>;
}

function Main({ children }) {
  return <main className="main-section">{children}</main>;
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function Error({ message }) {
  return <p className="error">⛔ {message}</p>;
}

function MovieList({ movies }) {
  return (
    <ul>
      {movies.map((movie) => (
        <Movies movie={movie} key={movie.imdbID} />
      ))}
    </ul>
  );
}

function Movies({ movie }) {
  return (
    <>
      <li>
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

function Box({ children }) {
  return (
    <section className="box">
      {/* <div class="details">
          <button class="btn-back">&#x1F860;</button>
          <img src="images/inception.jpg" alt="" height="200px" />
          <div class="movie-details">
            <h5>Inception</h5>
            <p>07 november 2014 . 169 min</p>
            <p>Adventure, Drama, sci-Fi</p>
            <p>⭐ 8.8 IMDb rating</p>
          </div>
        </div>

        <div class="details-info">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure,
            reprehenderit!
          </p>
          <p>Lorem ipsum dolor sit amet.</p>
          <p>Lorem, ipsum.</p>
        </div>  */}
      {children}
    </section>
  );
}

function WatchedSummary() {
  return (
    <div className="watched-summary">
      <h5>
        My WatchList <img src="watchlist-img.svg" alt="" />
      </h5>
      <div className="sum-list">
        <p>
          <img src="totalMovies-img.svg" alt="total-movie" />2 movies
        </p>
        <p>
          <img src="imdb-img.svg" alt="imdbRating" />
          8.65
        </p>
        <p>
          <img src="star-img.svg" alt="yourRating" />
          9.5
        </p>
        <p>
          <img src="time.svg" alt="avgHours" />
          132min
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watchedMovie }) {
  return (
    <ul>
      {watchedMovie.map((watched) => (
        <WatchedMovies watched={watched} />
      ))}
    </ul>
  );
}

function WatchedMovies({ watched }) {
  return (
    <li>
      <button className="btn-delete">x</button>
      <img
        className="movie-img"
        src={watched.Poster}
        alt={watched.Title}
        height="100px"
      />
      <h5>{watched.Title}</h5>
      <div className="watched-list">
        <p>
          <img src="imdb-img.svg" alt="imdbRating" />
          {watched.imdbRating}
        </p>
        <p>
          <img src="star-img.svg" alt="yourRating" />
          {watched.userRating}
        </p>
        <p>
          <img src="time.svg" alt="movieLength" />
          {watched.runtime}
        </p>
      </div>
    </li>
  );
}
