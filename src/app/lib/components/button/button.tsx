import styles from "./button.module.css";

type ButtonProps = React.PropsWithChildren<{
  level: "primary" | "secondary";
  fullWidth: boolean;
  rounded?: boolean;
  clickHandler?: () => void;
  submitting?: boolean;
}>;

export const Button: React.FC<ButtonProps> = ({
  level,
  fullWidth,
  rounded = false,
  clickHandler,
  submitting = false,
  children
}) => {
  let btnStyle;
  if (level === "primary") {
    if (submitting) {
      btnStyle = styles["primary-disabled"];
    } else {
      btnStyle = styles["primary"];
    }
  } else {
    if (submitting) {
      btnStyle = styles["secondary-disabled"];
    } else {
      btnStyle = styles["secondary"];
    }
  }
  return (
    <button
      onClick={clickHandler}
      onKeyDown={clickHandler}
      className={`${styles["btn"]} ${btnStyle} ${
        fullWidth ? styles["full-width"] : ""
      } ${rounded ? styles["rounded"] : ""} `}
      disabled={submitting ? submitting : false}
    >
      {children}
    </button>
  );
};
