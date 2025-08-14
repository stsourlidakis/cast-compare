const autoCompleteBaseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_AUTOCOMPLETE_URL
    : "http://localhost:3001";

const createFetchClient = (baseURL, defaultParams = {}) => {
  return {
    get: async (url, options = {}) => {
      const { signal } = options;

      const fullUrl = new URL(
        url.startsWith("/") ? url.slice(1) : url,
        baseURL.endsWith("/") ? baseURL : baseURL + "/"
      );

      // Add default params to URL
      Object.entries(defaultParams).forEach(([key, value]) => {
        fullUrl.searchParams.set(key, value);
      });

      const response = await fetch(fullUrl, {
        method: "GET",
        signal,
      });

      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.response = {
          status: response.status,
          data: await response.json().catch(() => ({})),
        };
        throw error;
      }

      const data = await response.json();
      return { data };
    },
  };
};

const personAutocomplete = createFetchClient(`${autoCompleteBaseUrl}/person`);

const movieAutocomplete = createFetchClient(`${autoCompleteBaseUrl}/movie`);

const theMovieDB = createFetchClient("https://api.themoviedb.org/3", {
  api_key: process.env.REACT_APP_THEMOVIEDB_API_KEY,
});

export { personAutocomplete, movieAutocomplete, theMovieDB };
