import styles from "./ComparedItem.module.css";
import Card from "../UI/Card/Card";
import ComparedItemPreview from "./ComparedItemPreview/ComparedItemPreview";
import Credits from "./Credits/Credits";

const ComparedItem = (props) => {
  const preview = props.loading ? (
    <div className={styles.loader}>Loading...</div>
  ) : (
    <ComparedItemPreview data={props.data} remove={props.remove} />
  );
  return (
    <div className={styles.ComparedItem}>
      <Card noBorder={props.loading}>{preview}</Card>
      {props.loading ? null : <Credits credits={props.data.credits} />}
    </div>
  );
};

export default ComparedItem;
