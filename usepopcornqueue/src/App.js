import { useEffect, useState } from "react";
import "./index.css";
import "./queries.css";
import StarRating from "./StarRating";

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
  const [selectedId, setSelectedId] = useState(null);

  function onMovieClick(id) {
    setSelectedId((previousId) => (previousId === id ? null : id));
  }

  function onCloseMovie() {
    setSelectedId(null);
  }

  function onAddWatched(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleClose(id) {
    setWatched((Watched) => watched.filter((movie) => movie.imdbID !== id));
  }
  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchMovies() {
        setIsLoading(true);
        setError("");
        try {
          const res = await fetch(
            `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&s=${query}
          `,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("something went wrong in fetching the movie");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not Found");
          setMovies(data.Search);
        } catch (err) {
          const message = err?.message || "Movie not found";

          if (err.name !== "AbortError") {
            setError(message);
          }

          setError("");
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 2) {
        setMovies([]);
        setError("");
        return;
      }

      onCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
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
          {!isLoading && !error && (
            <MovieList movies={movies} onMovieClick={onMovieClick} />
          )}
          {error && <Error message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              watched={watched}
              selectedId={selectedId}
              onCloseMovie={onCloseMovie}
              onAddWatched={onAddWatched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList
                watchedMovie={watched}
                handleClose={handleClose}
              />
            </>
          )}
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

function MovieList({ movies, onMovieClick }) {
  return (
    <ul>
      {movies.map((movie) => (
        <Movies movie={movie} key={movie.imdbID} onMovieClick={onMovieClick} />
      ))}
    </ul>
  );
}

function Movies({ movie, onMovieClick }) {
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

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [fetchedmovie, setFetchedMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  useEffect(
    function () {
      function callback(e) {
        if (e.code === "Escape") {
          onCloseMovie();
        }
      }
      document.addEventListener("keydown", callback);

      return function () {
        document.removeEventListener("keydown", callback);
      };
    },
    [onCloseMovie]
  );

  useEffect(
    function () {
      if (!fetchedmovie.Title) return;
      document.title = fetchedmovie.Title;

      return function () {
        document.title = "usepopcorn";
      };
    },
    [fetchedmovie.Title]
  );

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);

  const isUSerRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  function onAddNewMovie() {
    const newMovie = {
      imdbID: selectedId,
      Title: fetchedmovie.Title,
      Year: fetchedmovie.Year,
      Poster: fetchedmovie.Poster,
      imdbRating: Number(fetchedmovie.imdbRating),
      runtime: !NaN ? Number(fetchedmovie.Runtime.split(" ").at(0)) : "N/A",
      userRating,
    };

    onAddWatched(newMovie);
    onCloseMovie();
  }

  useEffect(
    function () {
      async function fetchMovieDetails() {
        setIsLoading(true);
        try {
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
          );

          if (!res.ok) throw new Error("unable to Fetch");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not Found");
          setFetchedMovie(data);
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      }

      fetchMovieDetails();
    },
    [selectedId]
  );

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <div className="details">
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img
              src={fetchedmovie.Poster}
              alt={fetchedmovie.imdbID}
              height="200px"
            />
            <div className="movie-details">
              <h5>{fetchedmovie.Title}</h5>
              <p>
                {fetchedmovie.Released} • {fetchedmovie.Runtime}
              </p>
              <p>{fetchedmovie.Genre}</p>
              <div className="details-imdb">
                <img src="imdb-img.svg" alt="imdb" />
                <p>{fetchedmovie.imdbRating}</p>
              </div>
            </div>
          </div>
          {!isWatched ? (
            <div className="star-rating">
              <StarRating
                maxRating={10}
                size={20}
                onSetRating={setUserRating}
              />
              {userRating > 0 && (
                <button className="add-btn" onClick={onAddNewMovie}>
                  + Add to List
                </button>
              )}
            </div>
          ) : (
            <p className="star-rating">You Rated this movie! {isUSerRating}</p>
          )}

          <div className="details-info">
            <p>{fetchedmovie.Plot}</p>
            <p>Starring: {fetchedmovie.Actors}</p>
            <p>Director: {fetchedmovie.Director}</p>
          </div>
        </>
      )}
    </>
  );
}

function WatchedSummary({ watched }) {
  const avgUserRating =
    watched.reduce((acc, movie) => acc + Number(movie.userRating), 0) /
    (watched.length || 1);

  const avgImdbRating =
    watched.reduce((acc, movie) => acc + Number(movie.imdbRating), 0) /
      watched.length || 0;
  return (
    <div className="watched-summary">
      <h5>
        My WatchList <img src="watchlist-img.svg" alt="" />
      </h5>
      <div className="sum-list">
        <p>
          <img src="totalMovies-img.svg" alt="total-movie" />
          {watched.length} {watched.length === 1 ? "movie" : "movies"}
        </p>
        <p>
          <img src="imdb-img.svg" alt="imdbRating" />
          {avgImdbRating.toFixed(2)}
        </p>
        <p>
          <img src="star-img.svg" alt="yourRating" />
          {avgUserRating.toFixed(2)}
        </p>
        <p>
          <img src="time.svg" alt="avgHours" />
          132min
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watchedMovie, handleClose }) {
  return (
    <ul>
      {watchedMovie.map((watched) => (
        <WatchedMovies watched={watched} handleClose={handleClose} />
      ))}
    </ul>
  );
}

function WatchedMovies({ watched, handleClose }) {
  return (
    <li>
      <button
        className="btn-delete"
        onClick={() => handleClose(watched.imdbID)}
      >
        x
      </button>
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
          {watched.runtime ?? "N/A"}
        </p>
      </div>
    </li>
  );
}
