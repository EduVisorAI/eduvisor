import styles from "./button.module.css";

type ButtonProps = React.PropsWithChildren<{
  level: "primary" | "secondary";
  fullWidth: boolean;
  rounded?: boolean;
  clickHandler?: () => void;
  submitting?: boolean;
  preventDefault?: boolean;
}>;

export const Button: React.FC<ButtonProps> = ({
  level,
  fullWidth,
  rounded = false,
  clickHandler,
  submitting = false,
  children,
  preventDefault = false
}) => {
  const btnStyle =
    styles[
      level === "primary"
        ? submitting
          ? "primary-disabled"
          : "primary"
        : submitting
        ? "secondary-disabled"
        : "secondary"
    ];

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (preventDefault) {
      e.preventDefault();
    }

    if (clickHandler) {
      clickHandler();
    }
  };

  const classNames = [
    styles["btn"],
    btnStyle,
    fullWidth ? styles["full-width"] : "",
    rounded ? styles["rounded"] : ""
  ].join(" ");

  return (
    <button
      onClick={handleClick}
      onKeyDown={clickHandler}
      className={classNames}
      disabled={submitting ? submitting : false}
    >
      {children}
    </button>
  );
};
