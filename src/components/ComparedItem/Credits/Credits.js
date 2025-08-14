import { useState, useCallback } from "react";
import ReactGA from "react-ga4";

import styles from "./Credits.module.css";
import Credit from "./Credit/Credit";

const DEFAULT_CREDITS_LIMIT = 6;
function Credits({ fullListVisible, credits, displayType }) {
  const [creditsLimited, setCreditsLimited] = useState(!fullListVisible);
  const [creditsLimit, setCreditsLimit] = useState(DEFAULT_CREDITS_LIMIT);

  const showMore = useCallback(() => {
    setCreditsLimit(credits.length);
    setCreditsLimited(false);

    ReactGA.event({
      category: "Credits",
      action: "show",
    });
  }, [credits.length]);

  const showLess = useCallback(() => {
    setCreditsLimit(DEFAULT_CREDITS_LIMIT);
    setCreditsLimited(true);

    ReactGA.event({
      category: "Credits",
      action: "hide",
    });
  }, []);

  let toggleLimitButton = null;
  if (!fullListVisible) {
    if (!creditsLimited) {
      toggleLimitButton = <button onClick={showLess}>Less..</button>;
    } else if (credits.length > creditsLimit) {
      toggleLimitButton = <button onClick={showMore}>More..</button>;
    }
  }

  const displayedCredits = fullListVisible
    ? credits
    : credits.slice(0, creditsLimit);

  return (
    <>
      <div className={displayType === "row" ? styles.row : styles.grid}>
        {displayedCredits.map((c) => (
          <Credit data={c} key={c.id} />
        ))}
      </div>
      <div className={styles.buttonWrapper}>{toggleLimitButton}</div>
    </>
  );
}

export default Credits;
