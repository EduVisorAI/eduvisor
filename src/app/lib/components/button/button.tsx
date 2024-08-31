import styles from "./button.module.css";

type ButtonProps = React.PropsWithChildren<{
  level: "primary" | "secondary";
  fullWidth: boolean;
  rounded?: boolean;
  clickHandler?: () => void;
  submitting?: boolean;
  preventDefault?: boolean; // Nueva propiedad para controlar el comportamiento de preventDefault
  additionalClasses?: string; // Nueva propiedad para añadir clases adicionales
}>;

export const Button: React.FC<ButtonProps> = ({
  level,
  fullWidth,
  rounded = false,
  clickHandler,
  submitting = false,
  children,
  preventDefault = false, // Por defecto, no previene el envío del formulario
  additionalClasses = "" // Default to an empty string
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

  // Modificado para manejar preventDefault según la propiedad
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
    additionalClasses,
    fullWidth ? styles["full-width"] : "",
    rounded ? styles["rounded"] : ""
  ].join(" ");

  return (
    <button
      onClick={handleClick} // Usar handleClick modificado
      onKeyDown={clickHandler}
      className={classNames} // Usar spread para los estilos
      disabled={submitting ? submitting : false}
    >
      {children}
    </button>
  );
};
