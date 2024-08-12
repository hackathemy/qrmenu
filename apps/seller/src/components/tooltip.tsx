"use client";

import Image from "next/image";
import { ReactNode, useState } from "react";
import { PopupContainer } from "./popup";
import { Button } from "./button";

export const Tooltip = ({ message }: { message?: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="ml-2.5 relative">
      <button
        type="button"
        onClick={() => {
          // alert(message);
          setVisible(true);
        }}
      >
        <Image src="/tooltip.png" width={17} height={17} alt="Tooltip" />
      </button>
      {visible && (
        <PopupContainer
          onCancel={() => {
            setVisible(false);
          }}
          minWidth="min-w-[400px]"
          className=""
        >
          <p className="text-[16px]/[24px] mt-3">{message}</p>
          <Button
            className="self-stretch mt-[30px] text-[16px]/[24px]"
            type="button"
            onClick={() => {
              setVisible(false);
            }}
          >
            닫기
          </Button>
        </PopupContainer>
      )}
    </div>
  );
};

export const TooltipPhoneAuthMessage = () => {
  return (
    <>
      카카오톡에 접속하여 알림을 확인해주세요. <br />
      알림톡이 오지 않았을경우 [재전송 ]버튼을 눌러주세요. <br /> 전송 후 3분
      후에 재 전송이 가능합니다.
    </>
  );
};
