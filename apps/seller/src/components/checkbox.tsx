import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from "react";

export const Checkbox = ({
  label,
  id,
  bold,
  inputProps,
}: {
  inputProps: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  label: ReactNode;
  id: string;
  bold?: boolean;
}) => {
  return (
    <label className="flex items-center" htmlFor={id}>
      <input type="checkbox" id={id} {...inputProps} />
      <span className={`ml-2 text-[14px] text-[#333] ${bold && "font-bold"}`}>
        {label}
      </span>
    </label>
  );
};
