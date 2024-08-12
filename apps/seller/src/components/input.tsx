import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
  useState,
} from "react";
import { InputLabel, InputLabelProps } from "./input-label";
import Image from "next/image";

export const Input = ({
  label,
  labelBold,
  inputProps,
  required,
  labelComponent,
  multiline,
  textareaProps,
  rightComponent,
}: {
  multiline?: boolean;
  rightComponent?: ReactNode;
  inputProps?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  textareaProps?: DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >;
} & InputLabelProps) => {
  const [pwOn, setPwOn] = useState(false);

  return (
    <div className="flex flex-col text-[14px]/[20px]">
      <InputLabel
        label={label}
        labelBold={labelBold}
        required={required}
        labelComponent={labelComponent}
      />
      <div className="self-stretch bg-[#fafafa] border-[#ccc] rounded-md flex border-[1px] items-center focus-within:!border-[#000] focus-within:!border-[2px]">
        {multiline ? (
          <textarea
            {...textareaProps}
            className={`flex-1 outline-none bg-transparent py-3 px-5 placeholder:text-[#999999] text-black self-stretch min-h-[200px]  ${textareaProps?.className} resize-none`}
          />
        ) : (
          <input
            {...inputProps}
            type={
              inputProps?.type === "password"
                ? pwOn
                  ? "text"
                  : "password"
                : inputProps?.type
            }
            className={`flex-1 outline-none bg-transparent py-3 px-5 placeholder:text-[#999999] text-black self-stretch  ${inputProps?.className}`}
          />
        )}

        {inputProps?.type === "password" && (
          <button
            type="button"
            onClick={() => setPwOn((prev) => !prev)}
            className="mr-[22px]"
          >
            <Image
              src={pwOn ? "/pw-on.png" : `/pw-off.png`}
              width={24}
              height={24}
              alt="Pw"
            />
          </button>
        )}
        {rightComponent && <div className="mx-5">{rightComponent}</div>}
      </div>
    </div>
  );
};
