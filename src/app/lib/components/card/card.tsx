import styles from "./card.module.css";

export const Card: React.FC<
  React.PropsWithChildren<{ direction: "row" | "column" }>
> = (props) => {
  return (
    <div
      className={`${styles["card"]} ${
        props.direction === "column" ? styles["col"] : ""
      }`}
    >
      {props.children}
    </div>
  );
};
