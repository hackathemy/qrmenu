import { ReactNode } from "react";
import { Tooltip } from "./tooltip";

export interface ContentSectionProps {
  children: ReactNode;
  title: string;
  message?: ReactNode;
}
export const ContentSection = ({
  title,
  children,
  message,
}: ContentSectionProps) => {
  return (
    <div className={`rounded-xl border-[1px] border-[#eee] p-5 flex flex-col`}>
      <span className="font-bold mb-4 flex items-center">
        {title}

        {message && <Tooltip message={message} />}
      </span>
      <div>{children}</div>
    </div>
  );
};
