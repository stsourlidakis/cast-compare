import React from "react";

import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.Footer}>
      {/*eslint-disable-next-line*/}
      <a href="https://github.com/stsourlidakis/cast-compare" target="_blank">
        Developed
      </a>{" "}
      by{" "}
      <a href="https://stsourlidakis.com" target="_blank" rel="noreferrer">
        stsourlidakis
      </a>{" "}
      with data from the{" "}
      <a
        href="https://www.themoviedb.org/documentation/api"
        target="_blank"
        rel="noopener noreferrer"
        title="This product uses the TMDb API but is not endorsed or certified by TMDb."
      >
        TMDb API
      </a>
      .
    </div>
  );
};

export default Footer;
