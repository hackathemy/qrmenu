import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export const Card = ({
  title,
  link,
  titleDivier,
  children,
  className,
  titleComponent,
  titleRightComponent,
}: {
  className?: string;
  titleComponent?: ReactNode;
  titleRightComponent?: ReactNode;
  children: ReactNode;
  title?: ReactNode;
  link?: string;
  titleDivier?: boolean;
}) => {
  return (
    <div
      className={`shadow-md rounded-xl border-[1px] border-[#eee] p-8 flex flex-col ${className}`}
    >
      {!!title && link ? (
        <Link href={link} className="flex items-center">
          <span className="font-bold text-[20px]">{title}</span>
          {titleComponent && <div className="ml-5">{titleComponent}</div>}
          {titleRightComponent && (
            <div className="ml-auto">{titleRightComponent}</div>
          )}
          {!!link && (
            <Link href={link} className="w-6 h-6 flex ml-auto">
              <Image
                className="m-auto"
                src="/chervon-right.png"
                width={9}
                height={16}
                alt="Chervon Right"
              />
            </Link>
          )}
        </Link>
      ) : (
        <div className="flex items-center">
          <span className="font-bold text-[20px]">{title}</span>
          {titleComponent && <div className="ml-5">{titleComponent}</div>}
          {titleRightComponent && (
            <div className="ml-auto">{titleRightComponent}</div>
          )}
        </div>
      )}

      {titleDivier && <div className="mt-5 border-b-[#eee] border-b-[1px]" />}
      <div className="mt-5 flex flex-col">{children}</div>
    </div>
  );
};
