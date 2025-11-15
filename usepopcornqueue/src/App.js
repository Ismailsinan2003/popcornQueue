import "./index.css";
import "./queries.css";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

export default function App() {
  return (
    <>
      <Navbar>
        <Logo />
        <Search />
        <Numresult />
      </Navbar>

      <Main>
        <Box>
          <MovieList />
        </Box>
        <Box>
          <WatchedSummary />
          <WatchedMovieList />
        </Box>
      </Main>
    </>
  );
}

function Navbar({ children }) {
  return <nav class="navbar">{children}</nav>;
}

function Logo() {
  return (
    <div class="logo">
      <img src="popcornQueue-logo.svg" alt="logo" />
      <h4 class="logo-text">popcornQueue</h4>
    </div>
  );
}

function Search() {
  return <input type="text" placeholder="Search Movies..." class="search" />;
}

function Numresult() {
  return <p class="numResult">Found 3 results</p>;
}

function Main({ children }) {
  return <main class="main-section">{children}</main>;
}

function MovieList() {
  return (
    <ul>
      {tempMovieData.map((movie) => (
        <Movies movie={movie} />
      ))}
    </ul>
  );
}

function Movies({ movie }) {
  return (
    <>
      <li>
        <img
          class="movie-img"
          src={movie.Poster}
          alt={movie.Title}
          height="100px"
        />
        <h5>{movie.Title}</h5>
        <p>
          <img class="search-logo" src="ReleaseYear.svg" alt="releaseDate" />
          {movie.Year}
        </p>
      </li>
    </>
  );
}

function Box({ children }) {
  return (
    <section class="box">
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
    <div class="watched-summary">
      <h5>
        My WatchList <img src="watchlist-img.svg" alt="" />
      </h5>
      <div class="sum-list">
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

function WatchedMovieList() {
  return (
    <ul>
      {tempWatchedData.map((watched) => (
        <WatchedMovies watched={watched} />
      ))}
    </ul>
  );
}

function WatchedMovies({ watched }) {
  console.log(watched);
  return (
    <li>
      <button class="btn-delete">x</button>
      <img
        class="movie-img"
        src={watched.Poster}
        alt={watched.Title}
        height="100px"
      />
      <h5>{watched.Title}</h5>
      <div class="watched-list">
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
