import { ReactNode } from "react";

export const RowGrid = ({
  label,
  children,
  labelComponent,
}: {
  labelComponent?: ReactNode;
  children?: ReactNode;
  label?: ReactNode;
}) => {
  return (
    <div>
      {!!label && (
        <span className="font-bold text-[20px] flex items-center">
          {label}
          {labelComponent}
        </span>
      )}
      {children && (
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-10 ">{children}</div>
      )}
    </div>
  );
};

export const Row = ({
  label,
  content,
  className,
  small,
  rightComponent,
  grey,
  large,
}: {
  grey?: boolean;
  large?: boolean;
  small?: boolean;
  label: ReactNode;
  content: ReactNode;
  rightComponent?: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`${className} flex items-center text-[16px]/[24px]`}>
      <div
        className={`${
          large ? "min-w-[160px]" : small ? "min-w-[60px]" : "min-w-[100px]"
        }`}
      >
        <span className="text-[#666] text-[14px]">{label}</span>
      </div>
      <div className={`flex-1 ${grey && "text-[#999]"}`}>{content}</div>
      {rightComponent}
    </div>
  );
};
