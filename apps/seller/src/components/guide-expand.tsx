import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import { SmallBorderButton } from "./small-border-button";
import { Switch } from "./switch";

export const GuideExpand = ({
  title,
  children,
  enabled,
  onEnabled,
  onEdit,
}: {
  enabled: boolean;
  onEnabled: (enabled: boolean) => void;
  title: ReactNode;
  onEdit: () => void;
  children?: ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open && !enabled) {
      setOpen(false);
    }
  }, [enabled, open]);

  return (
    <div className="flex flex-col border-[#eee] border-[1px] rounded-xl shadow-md self-stretch mb-3">
      <div
        className={`flex items-center p-5  ${enabled ? "cursor-pointer" : ""}`}
        onClick={(e) => {
          if (enabled) {
            setOpen((e) => !e);
          }
        }}
      >
        <Image
          width={24}
          height={24}
          src={"/menu.png"}
          alt="Menu"
          className="mr-3"
        />
        {/**
         *   <Image
          src={open ? "/up.png" : "/open.png"}
          width={24}
          height={24}
          alt="Expand"
        />
         */}

        <span className="flex-1 text-[20px] font-bold ml-5">{title}</span>
        <div className="mx-5" onClick={(e) => e.stopPropagation()}>
          {<Switch value={enabled} onChange={onEnabled} />}
        </div>
        <SmallBorderButton
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          편집
        </SmallBorderButton>
      </div>
      {open && (
        <div className="pt-5 pb-8 border-t-[1px] mx-8 flex flex-col">
          {children}
        </div>
      )}
    </div>
  );
};
