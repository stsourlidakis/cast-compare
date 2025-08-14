import { useRef, useEffect, memo, useState, useCallback } from "react";
import awesomplete from "awesomplete";
import "awesomplete/awesomplete.css";

import styles from "./Autocomplete.module.css";

const awesompleteOptions = {
  autoFirst: true,
  sort: false, //items are already sorted by number of votes on imdb
  minChars: 1,
  filter: () => true, //no need to filter them, they are all matches
};

const Autocomplete = memo(function Autocomplete({
  onSearch,
  onSelect,
  placeholder,
  focused,
}) {
  const [matches, setMatches] = useState([]);
  const awesompleteInstanceRef = useRef(null);
  const inputRef = useRef(null);

  const handleSearch = useCallback(
    async (e) => {
      const searchValue = e.target.value;

      if (searchValue.length > 0) {
        try {
          const results = await onSearch(searchValue);
          setMatches(results || []);
        } catch (err) {
          console.error("Search error:", err);
          setMatches([]);
        }
      } else {
        setMatches([]);
      }
    },
    [onSearch]
  );

  useEffect(() => {
    awesompleteInstanceRef.current = new awesomplete(
      inputRef.current,
      awesompleteOptions
    );

    const input = inputRef.current;
    input.addEventListener("awesomplete-selectcomplete", onSelect);

    if (focused) {
      input.focus();
    }

    return () => {
      input?.removeEventListener("awesomplete-selectcomplete", onSelect);
    };
  }, [onSelect, focused]);

  useEffect(() => {
    if (awesompleteInstanceRef.current && matches) {
      awesompleteInstanceRef.current.list = matches;
    }
  }, [matches]);

  return (
    <div className={styles.Autocomplete}>
      <input
        type="text"
        placeholder={placeholder || "Start typing a name.."}
        ref={inputRef}
        onChange={handleSearch}
      />
    </div>
  );
});

export default Autocomplete;
