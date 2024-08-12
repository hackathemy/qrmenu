import { DetailedHTMLProps, FormHTMLAttributes, ReactNode } from "react";
import { ButtonProps } from "./button";
import Image from "next/image";
import { AuthLayout } from "./auth-layout";
import { Buttons } from "./buttons";

export const AuthForm = ({
  formProps,
  title,
  children,
  buttons,
  onBack,
  footerComponent,
  gap,
  divider,
}: {
  gap?: string;
  divider?: boolean;
  footerComponent?: ReactNode;
  onBack?: () => void;
  children: ReactNode;
  buttons: ({ text: string } & ButtonProps)[];
  title: ReactNode;
  formProps?: DetailedHTMLProps<
    FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
  >;
}) => {
  return (
    <AuthLayout>
      <form className="w-full flex flex-col items-center" {...formProps}>
        {!onBack && (
          <div
            className={`${
              divider ? "border-b-[1px] border-[#eee] pb-10" : ""
            } self-stretch items-center justify-center flex`}
          >
            <h1 className={`text-[#101010] text-[36px]/[52px] font-bold`}>
              {title}
            </h1>
          </div>
        )}

        {!!onBack && (
          <div
            className={`flex items-center self-stretch pb-10 border-b-[1px] border-[#eee]`}
          >
            <button
              className="w-6 h-6 flex mr-3"
              onClick={onBack}
              type="button"
            >
              <Image
                src="/back.png"
                alt="Back"
                width={9}
                height={16}
                className="m-auto"
              />
            </button>
            <h1 className={`text-[#101010] text-[24px]/[34px] font-bold`}>
              {title}
            </h1>
          </div>
        )}

        <div
          className={`grid grid-flow-row auto-rows-auto  w-full my-10 ${
            gap || "gap-y-5"
          }`}
        >
          {children}
        </div>
        <Buttons buttons={buttons} />
      </form>
      {footerComponent}
    </AuthLayout>
  );
};
