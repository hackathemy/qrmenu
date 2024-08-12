import { ReactNode } from "react";

export const FoodStyle = ({
  icon,
  label,
}: {
  icon: ReactNode;
  label: ReactNode;
}) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-[64px] h-[64px] rounded-full flex items-center justify-center bg-[#f5f5f5]">
        {icon}
      </div>
      <p className="text-[12px]/[16px] mt-1 text-center">{label}</p>
    </div>
  );
};
