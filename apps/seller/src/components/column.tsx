import { ReactNode } from "react";

export const ColumnGrid = ({
  label,
  children,
  labelComponent,
}: {
  labelComponent?: ReactNode;
  children?: ReactNode;
  label: ReactNode;
}) => {
  return (
    <div>
      <span className="font-bold text-[20px] flex items-center">
        {label}
        {labelComponent}
      </span>
      {children && (
        <div className="grid grid-cols-2 gap-2.5 py-5">{children}</div>
      )}
    </div>
  );
};

export const Column = ({
  label,
  content,
  className,
}: {
  label: ReactNode;
  content: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`${className} flex flex-col`}>
      <div>
        <span className="text-[#666] text-[14px]">{label}</span>
      </div>
      <div className="flex-grow">{content}</div>
    </div>
  );
};
