import { ReactNode } from "react";

export const Title = ({ title }: { title: ReactNode }) => {
  return (
    <div className="p-4 flex items-center">
      <h2 className="text-[20px]/[28px]">{title}</h2>
    </div>
  );
};
