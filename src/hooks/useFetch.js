/*
 * useFetch.js — Generic custom hook for fetching data from any URL.
 *
 * Instead of writing the same fetch/loading/error logic in every component,
 * components call this hook with a URL and get back `data`, `loading`, and
 * `error` — plus a `refetch` function to manually re-trigger the request.
 */

import { useState, useEffect, useCallback } from 'react';

/*
 * useFetch — Fetches JSON data from `url` and tracks loading and error states.
 * @param {string} url     - The full URL to fetch data from.
 * @param {object} options - Optional fetch options (e.g. extra headers, method).
 * @returns {{ data, error, loading, refetch }} Reactive state values and a refetch trigger.
 */
export function useFetch(url, options = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  // Start in a loading state because the fetch fires immediately on mount.
  const [loading, setLoading] = useState(true);

  /*
   * fetch (inner function) — Performs the actual HTTP request and updates state.
   * Wrapped in useCallback so it is only recreated when `url` or `options` change,
   * preventing infinite re-render loops when passed as a useEffect dependency.
   */
  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          // Merge any caller-supplied headers on top of the default Content-Type.
          ...options.headers,
        },
        ...options,
      });

      // response.ok is false for 4xx/5xx status codes — treat those as errors.
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const json = await response.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      // Always clear the loading flag, even if the request failed.
      setLoading(false);
    }
  }, [url, options]);

  // Automatically run the fetch whenever the URL or fetch function changes.
  useEffect(() => {
    if (url) {
      fetch();
    }
  }, [url, fetch]);

  // Expose `refetch` so components can manually re-fetch (e.g. after a mutation).
  return { data, error, loading, refetch: fetch };
}
