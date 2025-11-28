import { useEffect, useRef, useState } from "react";
import "../styles/index.css";
import "../styles/queries.css";
import StarRating from "./StarRating";
import { useMovies } from "../Hooks/useMovies";
import { useLocalStorageState } from "../Hooks/useLocalStorageState";
import { useKey } from "../Hooks/useKey";
import Navbar from "./Navbar";
import Logo from "./Logo";
import Search from "./Search";
import Numresult from "./Numresult";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import MovieList from "./MovieList";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  // const [watched, setWatched] = useState([]);

  const [watched, setWatched] = useLocalStorageState([], "watched");

  const { movies, isLoading, error } = useMovies(query, onCloseMovie);

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
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} onCloseMovie={onCloseMovie} />
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

function Box({ children }) {
  return <section className="box">{children}</section>;
}

const KEY = "608e27e7";

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [fetchedmovie, setFetchedMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  useKey("Escape", onCloseMovie);

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
      RatingDecision: countRef.current,
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
        <WatchedMovies
          watched={watched}
          handleClose={handleClose}
          key={watched.imdbID}
        />
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
