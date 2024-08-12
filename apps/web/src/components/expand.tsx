import Image from "next/image";
import { ReactNode, useState } from "react";

export const Expand = ({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white w-full flex flex-col border-b-[1px] border-[#f1f1f1]">
      <button
        onClick={() => {
          setOpen((p) => !p);
        }}
        className="flex items-center h-[56px] px-4 "
      >
        <div className="w-9">{icon}</div>

        <span className="text-[16px] ml3 font-extrabold">{title}</span>

        <Image
          className="ml-auto"
          width={12}
          height={8}
          src={open ? "/chervon-up-grey.png" : "/chervon-down-grey.png"}
          alt="Chervon"
        />
      </button>
      {open && <div className="p-4 flex flex-col">{children}</div>}
    </div>
  );
};
