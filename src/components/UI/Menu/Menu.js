import { Link, useLocation } from "react-router-dom";

import styles from "./Menu.module.css";

const Menu = () => {
  const location = useLocation();
  const pages = ["movies", "people"];
  const defaultPage = "movies";
  let activePage = location.pathname.split("/")[1];
  if (activePage === "") {
    //in case of /
    activePage = defaultPage;
  }

  return (
    <div className={styles.Menu}>
      {pages.map((page) => (
        <Link
          to={`/${page}`}
          className={`${styles.link} ${page === activePage ? styles.active : ""}`}
          key={page}
        >{`Compare ${page}`}</Link>
      ))}
    </div>
  );
};

export default Menu;
