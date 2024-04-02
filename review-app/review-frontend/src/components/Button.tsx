import { FC } from "react";
import { ButtonProps } from "@/types/type";

const Button: FC<ButtonProps> = ({
  label,
  onClick,
  colorScheme,
  className,
  disabled = false,
}) => {
  const baseStyle =
    "font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline";
  const colorStyle = {
    purple: "bg-purple-500 hover:bg-purple-700 text-white",
    blue: "bg-blue-500 hover:bg-blue-700 text-white",
    slate: "bg-slate-600 hover:bg-slate-700 text-white",
    disabled: "bg-gray-300 text-gray-500 cursor-not-allowed",
  };

  const buttonColorScheme = disabled
    ? colorStyle["disabled"]
    : colorStyle[colorScheme];

  return (
    <button
      className={`${baseStyle} ${buttonColorScheme} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default Button;
