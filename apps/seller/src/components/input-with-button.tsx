import { ReactNode } from "react";
import { Button } from "./button";

export const InputWithButton = ({
  children,
  button,
}: {
  children: ReactNode;
  button: { text: string; onClick: () => void; disabled?: boolean };
}) => {
  return (
    <div className="flex items-end">
      <div className="flex-1">{children}</div>

      <Button
        disabled={button.disabled}
        type="button"
        className="ml-2 !border-[1px] !border-[#101010] font-bold !text-[14px] !bg-[#fff] !text-[#101010] min-w-[120px] !h-[46px]"
        onClick={button.onClick}
      >
        {button.text}
      </Button>
    </div>
  );
};
