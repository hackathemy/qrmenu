import { ReactNode } from "react";

export const Page = ({
  children,
  nav,
  footerHidden,
  bgWhite,
}: {
  children: ReactNode;
  bgWhite?: boolean;
  nav: ReactNode;
  footerHidden?: boolean;
}) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      {nav}
      <main className={`flex-grow  ${bgWhite ? "bg-[#fff]" : "bg-[#f1f1f1]"}`}>
        {children}
      </main>

      {!footerHidden && (
        <footer className="static bottom-0">
          <div className="bg-white border-t-[1px] border-t-[#ddd] h-[33px] flex items-center justify-center">
            <p className="text-[12px] text-[#666]">Powered by 잇모. 헤드리스</p>
          </div>
        </footer>
      )}
    </div>
  );
};
