import { useEffect, useState } from "react";

export function useLocalStorageState(initialstate, Key) {
  const [value, setValue] = useState(function () {
    const storedValue = localStorage.getItem(Key);
    return storedValue ? JSON.parse(storedValue) : JSON.parse(initialstate);
  });

  useEffect(
    function () {
      localStorage.setItem(Key, JSON.stringify(value));
    },
    [value, Key]
  );

  return [value, setValue];
}
