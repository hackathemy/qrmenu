import { ReactNode } from "react";

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-[#F1F1F1] w-full min-h-screen flex items-center justify-center">
      <div className="m-auto w-full max-w-[600px] bg-white rounded-2xl p-10 my-10 flex flex-col">
        {children}
      </div>
    </div>
  );
};
