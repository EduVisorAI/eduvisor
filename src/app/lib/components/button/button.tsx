import styles from "./button.module.css";

type ButtonProps = React.PropsWithChildren<{
  level: "primary" | "secondary";
  fullWidth: boolean;
  rounded?: boolean;
  clickHandler?: () => void;
  submitting?: boolean;
  preventDefault?: boolean; // Nueva propiedad para controlar el comportamiento de preventDefault
}>;

export const Button: React.FC<ButtonProps> = ({
  level,
  fullWidth,
  rounded = false,
  clickHandler,
  submitting = false,
  children,
  preventDefault = false // Por defecto, no previene el envío del formulario
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

  // Modificado para manejar preventDefault según la propiedad
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (preventDefault) {
      e.preventDefault();
    }

    if (clickHandler) {
      clickHandler();
    }
  };

  return (
    <button
      onClick={handleClick} // Usar handleClick modificado
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
