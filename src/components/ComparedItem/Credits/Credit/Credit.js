import React from "react";

import missing from "../../../../assets/images/missingPoster.png";
import styles from "./Credit.module.css";
import TmdbLink from "../../../TmdbLink/TmdbLink";

//the image is hidden initially so the alt text won't stretch the container while loading
const imageReady = (e) => {
  e.target.classList.remove(styles.loading);
};

const imageFailed = (e) => {
  e.target.src = missing;
};

const Credit = (props) => {
  const imgSrc = props.data.imagePath
    ? `https://image.tmdb.org/t/p/w92/${props.data.imagePath}`
    : missing;
  return (
    <TmdbLink type={props.data.type} id={props.data.id}>
      <img
        onLoad={imageReady}
        onError={imageFailed}
        className={`${styles.Credit} ${styles.loading}`}
        src={imgSrc}
        alt={props.data.title}
        title={`${props.data.title} ${props.data.subtitle}`}
      />
    </TmdbLink>
  );
};

export default Credit;
