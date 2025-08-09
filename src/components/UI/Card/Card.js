import React from "react";

import styles from "./Card.module.css";

const Card = (props) => {
  const classes = [styles.Card, props.noBorder ? styles.noBorder : ""].join(
    " "
  );
  return <div className={classes}>{props.children}</div>;
};

export default Card;
