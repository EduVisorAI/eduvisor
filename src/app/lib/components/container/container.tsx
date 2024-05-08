import styles from "./container.module.css";
import { Navigation } from "../navigation/navigation";

export const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className={styles["background"]}>
      <Navigation />
      <div className={styles["container"]}>{children}</div>
    </div>
  );
};
