import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from "react";

export type ButtonProps = {
  variation?: "border" | "normal" | "error";
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

export const Button = (props: ButtonProps) => {
  return (
    <button
      {...props}
      className={`font-bold bg-[#101010] text-white rounded-md h-[48px] ${
        props.className
      } ${
        props.variation === "border" &&
        "!bg-transparent !text-[#101010] !border-[#101010] border-[1px]"
      } ${props.variation === "error" && "!bg-[#ff0000]"}`}
    >
      {props.children}
    </button>
  );
};
