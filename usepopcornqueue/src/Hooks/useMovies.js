import { useEffect, useState } from "react";

export function useMovies(query, callback) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const KEY = "608e27e7";

  useEffect(
    function () {
      callback?.();
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

      //   onCloseMovie();
      fetchMovies();

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
