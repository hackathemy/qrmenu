import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

export const SmallBorderButton = (
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => {
  return (
    <button
      {...props}
      className={`text-[14px] py-2 px-3 font-bold border-[#ccc] border-[1px] rounded-md text-center ${props.className}`}
    >
      {props.children}
    </button>
  );
};
