import { ReactNode } from "react";

export const Page = ({
  children,
  label,
  labelRightComponent,
  labelLeftComponent,
  borderDisabled,
}: {
  labelRightComponent?: ReactNode;
  labelLeftComponent?: ReactNode;
  children: ReactNode;
  label: ReactNode;
  borderDisabled?: boolean;
}) => {
  return (
    <div className="w-full flex-grow p-10 flex flex-col">
      <div
        className={`${
          !borderDisabled && "border-b-[1px] border-[#eee]"
        } self-stretch flex items-center justify-between pb-5 max-[1440px]:flex-col max-[1440px]:items-start`}
      >
        <div className="flex items-center max-[1440px]:flex-col max-[1440px]:items-start">
          {labelLeftComponent}
          <h2 className="text-[36px]/[52px] font-bold text-[#101010]">
            {label}
          </h2>
        </div>
        {labelRightComponent}
      </div>
      <main className="py-5">{children}</main>
    </div>
  );
};
