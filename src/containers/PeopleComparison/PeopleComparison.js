import GenericComparison from "../GenericComparison/GenericComparison";
import { personAutocomplete, theMovieDB } from "../../axios";
import styles from "../GenericComparison/GenericComparison.module.css";

const peopleConfig = {
  bodyClass: "people",
  theme: "people",
  gaCategory: "Person",
  urlPath: "people",
  placeholder: "Start typing a name..",
  autocompleteApi: personAutocomplete,
  dataApi: theMovieDB,

  extraStateFields: {
    commonShowsCounter: 0,
    commonMoviesCounter: 0,
  },

  getApiUrl: (personId) =>
    `/person/${personId}?append_to_response=combined_credits`,

  createNewItem: (person) => {
    const personData = {
      type: "person",
      imagePath: person.profile_path,
      imdbId: person.imdb_id,
      dateTitle: "Born",
      date: person.birthday,
      name: person.name,
      id: person.id,
    };

    const isActor = person.known_for_department === "Acting";
    const relevantCredits = person.combined_credits[isActor ? "cast" : "crew"];

    const uniqueCredits = relevantCredits.reduce((unique, credit) => {
      if (!unique.find((c) => c.id === credit.id)) {
        unique.push(credit);
      }
      return unique;
    }, []);

    const isCreditTalkShow = (credit) =>
      /himself|herself|narrator|^$/i.test(credit.character);

    const sortedCredits = uniqueCredits.sort((a, b) => {
      if (isCreditTalkShow(a)) {
        return 1;
      } else if (isCreditTalkShow(b)) {
        return -1;
      } else {
        return b.popularity - a.popularity;
      }
    });

    const credits = sortedCredits.map((credit) => ({
      id: credit.id,
      type: credit.media_type,
      title: credit.media_type === "tv" ? credit.name : credit.title,
      subtitle: credit.release_date ? `(${credit.release_date})` : "",
      imagePath: credit.poster_path,
    }));

    return {
      ...personData,
      credits,
    };
  },

  initExtraCounters: () => ({
    commonShowsCounter: 0,
    commonMoviesCounter: 0,
  }),

  resetExtraCounters: () => ({
    commonShowsCounter: 0,
    commonMoviesCounter: 0,
  }),

  updateExtraCounters: (credit, counters) => {
    if (credit.type === "tv") {
      return {
        ...counters,
        commonShowsCounter: counters.commonShowsCounter + 1,
      };
    } else {
      return {
        ...counters,
        commonMoviesCounter: counters.commonMoviesCounter + 1,
      };
    }
  },

  getInitialHelpText: () => (
    <>
      Select two or more <span className={styles.highlighted}>People</span>
    </>
  ),

  getCommonCreditsHelpText: (state) => {
    if (state.commonMoviesCounter > 0 && state.commonShowsCounter > 0) {
      return `Common Movies(${state.commonMoviesCounter}) and TV shows(${state.commonShowsCounter}):`;
    } else if (state.commonMoviesCounter > 0) {
      return `Common Movies(${state.commonMoviesCounter}):`;
    } else {
      return `Common TV shows(${state.commonShowsCounter}):`;
    }
  },

  noCommonCreditsText: "No common Movies or TV shows found",
};

const PeopleComparison = (props) => {
  return <GenericComparison config={peopleConfig} {...props} />;
};

export default PeopleComparison;
