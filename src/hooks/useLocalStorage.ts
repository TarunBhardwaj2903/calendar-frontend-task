"use client";

import { useState, useEffect } from "react";

/**
 * SSR-safe hook for reading/writing localStorage.
 * Returns the initial value during server-side rendering,
 * then hydrates with the stored value on the client.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch {
      // localStorage unavailable or corrupted
    }
  }, [key]);

  const setValue = (value: T) => {
    setStoredValue(value);
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage full or unavailable
    }
  };

  return [storedValue, setValue];
}
