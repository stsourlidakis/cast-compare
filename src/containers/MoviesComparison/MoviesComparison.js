import GenericComparison from "../GenericComparison/GenericComparison";
import { movieAutocomplete, theMovieDB } from "../../axios";
import styles from "../GenericComparison/GenericComparison.module.css";

const moviesConfig = {
  bodyClass: "movies",
  theme: "movies",
  gaCategory: "Movie",
  urlPath: "movies",
  urlReplaceOption: true,
  placeholder: "Start typing a title..",
  autocompleteApi: movieAutocomplete,
  dataApi: theMovieDB,

  getApiUrl: (movieId) => `/movie/${movieId}?append_to_response=credits`,

  createNewItem: (movie) => {
    const movieData = {
      type: "movie",
      imagePath: movie.poster_path,
      imdbId: movie.imdb_id,
      dateTitle: "Released",
      date: movie.release_date,
      name: movie.original_title,
      id: movie.id,
    };

    const uniqueCredits = movie.credits.cast.reduce((unique, credit) => {
      if (!unique.find((c) => c.id === credit.id)) {
        unique.push(credit);
      }
      return unique;
    }, []);

    const credits = uniqueCredits.map((person) => ({
      id: person.id,
      type: "person",
      title: person.name,
      subtitle: person.character ? `(${person.character})` : `(${person.job})`,
      imagePath: person.profile_path,
    }));

    return {
      ...movieData,
      credits,
    };
  },

  processCommonCredit: (credit) => ({
    ...credit,
    subtitle: "",
  }),

  getInitialHelpText: () => (
    <>
      Select two or more <span className={styles.highlighted}>Movies</span>
    </>
  ),

  getCommonCreditsHelpText: (state) =>
    `Common Actors(${state.commonCredits.length}):`,

  noCommonCreditsText: "No common Actors found",
};

const MoviesComparison = (props) => {
  return <GenericComparison config={moviesConfig} {...props} />;
};

export default MoviesComparison;
