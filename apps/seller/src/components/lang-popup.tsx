"use client";

import { useLangPopupStore } from "@hackathon-qrmenu/store";
import { PopupContainer } from "./popup";
import { Button } from "./button";
import { useLang } from "@/hooks/use-lang";
import { LangCode } from "@hackathon-qrmenu/type";
import { InputLabel } from "./input-label";
import { useEffect, useState } from "react";

export const LangPopup = ({}) => {
  const callback = useLangPopupStore((s) => s.callback);
  const hide = useLangPopupStore((s) => s.hide);
  const open = useLangPopupStore((s) => s.open);
  const waitSettled = useLangPopupStore((s) => s.waitSettled);
  const langCode = useLang();

  const [loading, setLoading] = useState<null | "1" | "2">(null);

  const [ta, setTa] = useState(false);

  useEffect(() => {
    if (!open) {
      setLoading(null);
    }
  }, [open]);

  /** */
  return (
    <div>
      {ta && (
        <PopupContainer
          onCancel={() => {
            setTa(false);
          }}
          minWidth="min-w-[400px]"
          className=""
        >
          <p className="text-[16px]/[24px] mt-3">
            외국어 번역이 진행중입니다.
            <br /> 번역된 내용이 반영되는 데에는 최대 10분까지 소요될 수
            있습니다.
          </p>
          <Button
            className="self-stretch mt-[30px] text-[16px]/[24px]"
            type="button"
            onClick={() => {
              setTa(false);
            }}
          >
            확인
          </Button>
        </PopupContainer>
      )}
      {open && (
        <PopupContainer onCancel={hide} className="!min-w-[600px] w-[600px]">
          <div className="grid grid-flow-row gap-y-5">
            <InputLabel labelBold label="입력을 완료하셨나요?" />
            {langCode === LangCode.KO ? (
              <>
                <p>
                  완료되었다면 저장과 동시에 다른 언어로 자동으로 번역되어
                  적용됩니다.
                  <br />* '한국어' 항목으로 입력한 내용을 기준으로 자동으로 다른
                  언어로 번역되며, '한국어' 이외의 언어로 입력되어 있는 내용들은
                  모두 덮어쓰기 됩니다.
                </p>
                <Button
                  disabled={loading !== null}
                  onClick={() => {
                    if (callback) {
                      callback(true, () => {
                        if (waitSettled) {
                          hide();
                          setTa(true);
                        }
                        //setLoading(null);
                        //hide();
                      });
                      if (!waitSettled) {
                        hide();
                        setTa(true);
                      }
                    }
                  }}
                >
                  {loading === "1" ? "저장중입니다..." : "저장 + 번역"}
                </Button>

                <div />
                <div />
                <p>
                  아니오, 우선 내용만 저장하고, 번역 적용은 나중에 하겠습니다.{" "}
                  <br />
                  번역 적용은 나중에 별도로 진행할 수 있습니다. <br />
                  *'한국어' 이외의 언어 항목 내용을 수정한 부분도 같이
                  저장됩니다.
                </p>
                <Button
                  disabled={loading !== null}
                  onClick={() => {
                    if (callback) {
                      setLoading("2");
                      callback(false, () => {
                        setLoading(null);
                        hide();
                      });
                    }
                  }}
                >
                  {loading === "2" ? "저장중입니다..." : "저장만 하기"}
                </Button>
              </>
            ) : (
              <Button
                disabled={loading !== null}
                onClick={() => {
                  if (callback) {
                    setLoading("2");
                    callback(false, () => {
                      setLoading(null);
                      hide();
                    });
                  }
                }}
              >
                {loading === "2" ? "저장중입니다..." : "저장 하기"}
              </Button>
            )}
          </div>
        </PopupContainer>
      )}
    </div>
  );
};
