import { ReactNode } from "react";
import { Button } from "./button";
import Image from "next/image";

interface PopupContainerProps {
  minWidth?: string;
  onCancel?: () => void;
}

export const PopupContainer = ({
  children,
  onCancel,
  minWidth,
  className,
}: PopupContainerProps & { children: ReactNode; className?: string }) => {
  return (
    <div className="fixed left-0 right-0 bottom-0 top-0 z-30 flex bg-[rgba(0,0,0,0.7)]">
      <div
        className={`m-auto rounded-2xl bg-white p-10  ${
          minWidth || "min-w-[600px]"
        } flex flex-col items-center relative max-h-[90vh] max-[1440px]:max-h-[calc(100%_-20px)] overflow-y-auto ${className}`}
      >
        <button type="button" className="self-end" onClick={onCancel}>
          <Image src="/del.png" alt="Del" width={12} height={12} />
        </button>
        {children}
      </div>
    </div>
  );
};

export const Popup = ({
  title,
  children,
  confirmLabel,
  onConfirm,
  onCancel,
  minWidth,
  bigTitle,
}: {
  confirmLabel: string;
  bigTitle?: boolean;
  onConfirm?: () => void;
  title?: ReactNode;
  children: ReactNode;
} & PopupContainerProps) => {
  return (
    <PopupContainer onCancel={onCancel} minWidth={minWidth}>
      {title &&
        (bigTitle ? (
          <h3 className="font-bold text-[32px]/[40px] mt-3 self-start">
            {title}
          </h3>
        ) : (
          <h3 className="font-bold text-[24px]/[34px] mt-3">{title}</h3>
        ))}

      <div className="flex flex-col my-[30px] w-full">{children}</div>

      <div className="grid grid-cols-2 gap-x-2 self-end">
        <Button
          onClick={onCancel}
          type="button"
          className="!text-[14px] w-[120px] !h-[44px] !bg-[#ccc]"
        >
          취소
        </Button>
        <Button
          onClick={onConfirm}
          className="!text-[14px] w-[120px] !h-[44px]"
        >
          {confirmLabel}
        </Button>
      </div>
    </PopupContainer>
  );
};
