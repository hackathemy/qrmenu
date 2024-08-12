import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export const Button = (
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => {
  return (
    <button
      {...props}
      className={`bg-black text-white rounded-md h-12 px-5 ${props.className}`}
    >
      {props.children}
    </button>
  );
};
