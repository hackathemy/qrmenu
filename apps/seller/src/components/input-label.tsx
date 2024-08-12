import { ReactNode } from "react";

export interface InputLabelProps {
  label?: ReactNode;
  labelBold?: ReactNode;
  required?: boolean;
  labelComponent?: ReactNode;
}

export const InputLabel = ({
  label,
  required,
  labelBold,
  labelComponent,
}: InputLabelProps) => {
  if (!label) return null;
  return (
    <div className="mb-2 flex items-center">
      <label
        className={`text-[#333333]  ${labelBold && "text-[16px] font-bold"}`}
      >
        {label}
        {required && (
          <span
            className={`text-[14px] text-[#ff0000] font-bold ${
              labelBold && "!text-[16px]"
            }`}
          >
            *
          </span>
        )}
      </label>
      {labelComponent}
    </div>
  );
};
