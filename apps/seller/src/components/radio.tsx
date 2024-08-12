import { DetailedHTMLProps, InputHTMLAttributes } from "react";

export const Radio = ({
  label,
  id,
  bold,
  inputProps,
}: {
  inputProps: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  label: string;
  id: string;
  bold?: boolean;
}) => {
  return (
    <label className="flex items-center" htmlFor={id}>
      <input type="radio" id={id} {...inputProps} />
      <span className={`ml-2 text-[14px] text-[#333] ${bold && "font-bold"}`}>
        {label}
      </span>
    </label>
  );
};
