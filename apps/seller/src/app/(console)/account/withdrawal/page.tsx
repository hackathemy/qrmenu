"use client";

import { Buttons } from "@/components/buttons";
import { Column } from "@/components/column";
import { Input } from "@/components/input";
import { InputMessage } from "@/components/input-message";
import { InputWithButton } from "@/components/input-with-button";
import { Page } from "@/components/page";
import { Timer } from "@/components/timer";
import { Tooltip, TooltipPhoneAuthMessage } from "@/components/tooltip";
import { ApiError, apiClient } from "@hackathon/api-client";
import { useAccountStore, useSellerStore } from "@hackathon/store";
import { HttpStatusCode } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface FormValue {
  ceoName: string;
  password: string;
  phoneNumber: string;
  authId: number | null;
  authCode: string;
}

const defaultValues: FormValue = {
  ceoName: "",
  password: "",
  phoneNumber: "",
  authId: null,
  authCode: "",
};

export default function AccountWithdrawal() {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);

  const [authed, setAuthed] = useState(false);

  const form = useForm({ defaultValues });

  const authId = form.watch("authId");
  const phoneNumber = form.watch("phoneNumber");
  const ceoName = form.watch("ceoName");
  const password = form.watch("password");

  useEffect(() => {
    if (ceoName) {
      const regexp = /[a-z0-9]|[ \[\]{}()<>?|`~!@#$%^&*-_+=,.;:\"'\\]/g;
      let tm = setTimeout(() => {
        if (regexp.test(ceoName)) {
          form.setError("ceoName", {
            message: "사업자등록 대표자명을 확인해 주세요.",
          });
        } else {
          form.clearErrors("ceoName");
        }
      }, 500);
      return () => {
        clearTimeout(tm);
      };
    }
  }, [ceoName]);

  useEffect(() => {
    if (password) {
      let tm = setTimeout(() => {
        if (
          !password.match(
            "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$"
          )
        ) {
          form.setError("password", {
            message:
              "비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해 주세요.",
          });
        } else {
          form.clearErrors("password");
        }
      }, 500);
      return () => {
        clearTimeout(tm);
      };
    }
  }, [password]);

  const authLoadingRef = useRef(false);

  const sendAuth = async () => {
    if (authLoadingRef.current) return;

    authLoadingRef.current = true;
    try {
      const res = await apiClient.post("/accounts:authPhone", { phoneNumber });
      form.setValue("authId", res.data.authId as number);
      form.setValue("authCode", "");
      setAuthed(false);
      alert("입력하신 휴대폰번호로 인증번호를 발송했습니다.");
    } catch (error: unknown) {
      console.error(error);
    }
    authLoadingRef.current = false;
  };

  useEffect(() => {
    clearAuth();
  }, [phoneNumber]);

  const clearAuth = () => {
    form.setValue("authCode", "");
    form.setValue("authId", null);
    setAuthed(false);
  };

  const checkAuth = async () => {
    if (authLoadingRef.current) return;

    const authCode = form.getValues("authCode");

    authLoadingRef.current = true;
    try {
      const res = await apiClient.post("/accounts:authPhone", {
        phoneNumber,
        authId,
        authCode,
      });
      setAuthed(true);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      if (apiError.status === HttpStatusCode.UnprocessableEntity) {
        alert("인증번호를 다시 확인해 주세요.");
      } else {
        console.error(error);
      }
    }
    authLoadingRef.current = false;
  };

  const onSubmit = async (value: FormValue) => {
    if (!value.ceoName) {
      return form.setError(
        "ceoName",
        {
          message: "대표자명을 입력해 주세요.",
          type: "onChange",
        },
        { shouldFocus: true }
      );
    } else if (!value.password) {
      return form.setError(
        "password",
        {
          message: "비밀번호를 입력해 주세요.",
          type: "onChange",
        },
        { shouldFocus: true }
      );
    } else if (!value.phoneNumber) {
      return form.setError(
        "phoneNumber",
        {
          message: "휴대폰번호를 입력해 주세요.",
          type: "onChange",
        },
        { shouldFocus: true }
      );
    } else if (!authed) {
      return form.setError(
        "authCode",
        {
          message: "휴대폰 인증을 완료해 주세요.",
          type: "onChange",
        },
        { shouldFocus: true }
      );
    }
    setConfirm(true);
  };

  const seller = useSellerStore((s) => s.seller);
  const accountId = useAccountStore((s) => s.account?.id);
  const email = useAccountStore((s) => s.account?.email);

  const handleLogOut = () => {
    fetch("/api/signout", { method: "POST" }).then(() => {
      window.location.replace("/signin");
    });
  };

  const withdrawal = async () => {
    const values = form.getValues();
    try {
      const { data } = await apiClient.post(`/accounts/${accountId}:delete`, {
        ceoName: values.ceoName,
        password: values.password,
        authId: values.authId,
      });
      alert("회원 탈퇴가 완료되었습니다.");
      handleLogOut();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      setConfirm(false);
      console.error(apiError);
      if (apiError.data?.code === 11) {
        return form.setError(
          "ceoName",
          { message: "사업자등록 대표자명을 확인해 주세요." },
          { shouldFocus: true }
        );
      } else if (apiError.data?.code === 12) {
        return form.setError(
          "password",
          { message: "비밀번호를 잘못 입력했습니다." },
          { shouldFocus: true }
        );
      }
      alert(
        "회원 탈퇴 실패했습니다. 비밀번호와 휴대폰 번호를 다시 확인해 주세요."
      );
    }
  };

  return (
    <Page label="탈퇴 확인">
      <div className="flex flex-col">
        <form
          className="w-full mx-auto max-w-[600px] p-10"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <Column label="아이디" content={email} />
          <div className="grid gap-y-5 my-10">
            <div>
              <Input
                label="이름"
                inputProps={{
                  placeholder: "사업자등록 대표자명을 입력해주세요.",
                  ...form.register("ceoName"),
                }}
              />
              <InputMessage
                error
                message={form.formState.errors.ceoName?.message}
              />
            </div>

            <div>
              <Input
                label="비밀번호"
                inputProps={{
                  placeholder: "비밀번호를 입력해주세요.",
                  type: "password",
                  ...form.register("password"),
                }}
              />
              <InputMessage
                error
                message={form.formState.errors.password?.message}
              />
            </div>

            <div>
              <InputWithButton
                button={{
                  text: authId ? "재전송" : "인증번호 전송",
                  onClick: sendAuth,
                  disabled: !!authId || !phoneNumber || authed,
                }}
              >
                <Input
                  label="휴대폰번호"
                  inputProps={{
                    placeholder: "대표 전화번호를 입력해주세요.",
                    ...form.register("phoneNumber"),
                  }}
                />
              </InputWithButton>
              <InputMessage
                error
                message={form.formState.errors.phoneNumber?.message}
              />

              <div className="mt-5">
                <InputWithButton
                  button={{
                    text: authed ? "인증됨" : "확인",
                    onClick: checkAuth,
                    disabled: !authId || authed,
                  }}
                >
                  <Input
                    label="인증번호 확인"
                    inputProps={{
                      placeholder: "인증번호 숫자 6자리",
                      ...form.register("authCode"),
                      disabled: !authId || authed,
                    }}
                    rightComponent={
                      !authed &&
                      authId && <Timer key={authId} onTimeout={clearAuth} />
                    }
                  />
                </InputWithButton>
                <InputMessage
                  error
                  message={form.formState.errors.authCode?.message}
                />

                <div className="flex items-center mt-3 text-[10px] text-[#666]">
                  인증번호가 오지 않나요?
                  <Tooltip message={<TooltipPhoneAuthMessage />} />
                </div>
              </div>
            </div>
          </div>

          <Buttons
            buttons={[
              { text: "취소", onClick: router.back },
              {
                text: "탈퇴하기",
                variation: "error",
                disabled:
                  !!form.formState.errors.ceoName?.message ||
                  !!form.formState.errors.password?.message,
              },
            ]}
          />
        </form>
      </div>

      {confirm && (
        <div className="fixed left-0 right-0 bottom-0 top-0 z-30 flex bg-[rgba(0,0,0,0.7)]">
          <div className="m-auto rounded-2xl bg-white p-10 flex flex-col items-center relative">
            <button
              className="self-end"
              onClick={() => {
                setConfirm(false);
              }}
            >
              <Image src="/del.png" alt="Del" width={12} height={12} />
            </button>

            <p className="mb-[30px] mt-3">
              <span className="font-bold text-[20px]">{seller?.ceoName}</span>님{" "}
              <br />
              회원탈퇴를 하시면 저장한 모든 정보를 볼 수 없게 됩니다.
              <br />
              신중하게 다시 한 번 생각해보세요.
              <br />
              관리자 확인 후 탈퇴 처리가 완료됩니다.
            </p>

            <Buttons
              buttons={[
                {
                  text: "취소",
                  onClick: () => {
                    setConfirm(false);
                  },
                },
                {
                  text: "탈퇴",
                  variation: "error",
                  onClick: withdrawal,
                },
              ]}
            />
          </div>
        </div>
      )}
    </Page>
  );
}
