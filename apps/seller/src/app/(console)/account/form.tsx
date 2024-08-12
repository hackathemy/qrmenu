import { Input } from "@/components/input";
import { InputMessage } from "@/components/input-message";
import { InputWithButton } from "@/components/input-with-button";
import { Popup } from "@/components/popup";
import { Timer } from "@/components/timer";
import { Tooltip, TooltipPhoneAuthMessage } from "@/components/tooltip";
import { ApiError, apiClient } from "@hackathon-qrmenu/api-client";
import { useAccountStore } from "@hackathon-qrmenu/store";
import { HttpStatusCode } from "axios";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface FormValue {
  phoneNumber: string;
  authId: number | null;
  authCode: string;
}

const defaultValues: FormValue = {
  authCode: "",
  authId: null,
  phoneNumber: "",
};

export const PhoneUpdateForm = ({ onClose }: { onClose: () => void }) => {
  const [authed, setAuthed] = useState(false);
  const accountId = useAccountStore((s) => s.account?.id);

  const form = useForm({ defaultValues });

  const authId = form.watch("authId");
  const phoneNumber = form.watch("phoneNumber");

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

  const setAccount = useAccountStore((s) => s.setAccount);
  const onSubmit = async (value: FormValue) => {
    if (!value.phoneNumber) {
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

    try {
      const { data } = await apiClient.post(
        `/accounts/${accountId}:updatePhoneNumber`,
        {
          authId,
        }
      );
      setAccount(data.account);
      alert("휴대폰번호 변경이 완료되었습니다.");
      onClose();
    } catch (error: unknown) {
      console.error(error);
      alert("휴대폰번호 변경 실패했습니다.");
    }
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Popup confirmLabel="저장" title="휴대폰번호 변경" onCancel={onClose}>
          <div>
            <InputWithButton
              button={{
                text: authId ? "재전송" : "인증번호 전송",
                onClick: sendAuth,
                disabled: !!authId || !phoneNumber || authed,
              }}
            >
              <Input
                label="새 휴대폰번호"
                inputProps={{
                  placeholder: "변경할 휴대폰번호를 입력해주세요.",
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
        </Popup>
      </form>
    </div>
  );
};

interface FormValue2 {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}

const defaultValues2: FormValue2 = {
  currentPassword: "",
  password: "",
  passwordConfirm: "",
};

export const PasswordUpdateForm = ({ onClose }: { onClose: () => void }) => {
  const accountId = useAccountStore((s) => s.account?.id);

  const form = useForm({ defaultValues: defaultValues2 });

  const onSubmit = async (value: FormValue2) => {
    if (!value.currentPassword) {
      return form.setError(
        "currentPassword",
        {
          message: "현재 비밀번호를 입력해 주세요.",
          type: "onChange",
        },
        { shouldFocus: true }
      );
    } else if (!value.password) {
      return form.setError(
        "password",
        {
          message: "새 비밀번호를 입력해 주세요.",
          type: "onChange",
        },
        { shouldFocus: true }
      );
    } else if (value.password !== value.passwordConfirm) {
      return form.setError(
        "passwordConfirm",
        {
          message: "비밀번호가 일치하지 않습니다.",
          type: "onChange",
        },
        { shouldFocus: true }
      );
    }

    try {
      await apiClient.post(`/accounts/${accountId}:updatePassword`, {
        password: value.currentPassword,
        newPassword: value.password,
      });

      alert("비밀번호 변경이 완료되었습니다.");
      onClose();
    } catch (error: unknown) {
      const apiError = error as ApiError;
      console.error(apiError);
      if (apiError.status === HttpStatusCode.UnprocessableEntity) {
        return form.setError(
          "currentPassword",
          {
            message: "현재 비밀번호가 일치하지 않습니다.",
            type: "onChange",
          },
          { shouldFocus: true }
        );
      }
      alert("비밀번호 변경 실패했습니다.");
    }
  };

  return (
    <div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Popup confirmLabel="저장" title="비밀번호" onCancel={onClose}>
          <div>
            <Input
              label="현재 비밀번호"
              required
              inputProps={{
                placeholder: "현재 비밀번호",
                type: "password",
                ...form.register("currentPassword"),
              }}
            />
            <InputMessage
              error
              message={form.formState.errors.currentPassword?.message}
            />
          </div>
          <div className="mt-[30px]">
            <Input
              required
              label="새 비밀번호"
              inputProps={{
                type: "password",
                ...form.register("password"),
                placeholder: "새 비밀번호를 입력해주세요.",
              }}
            />
            <InputMessage
              error
              message={form.formState.errors.password?.message}
            />
            <InputMessage
              message={
                "영문, 대소문자, 숫자, 특수문자를 3가지 이상으로 조합해 8자 이상 24자 이하로 입력해주세요."
              }
            />
          </div>

          <div className="mt-5">
            <Input
              required
              label="새 비밀번호 확인"
              inputProps={{
                type: "password",
                ...form.register("passwordConfirm"),
                placeholder: "새 비밀번호를 다시 입력해 주세요.",
              }}
            />
            <InputMessage
              error
              message={form.formState.errors.passwordConfirm?.message}
            />
            <InputMessage
              message={
                "영문, 대소문자, 숫자, 특수문자를 3가지 이상으로 조합해 8자 이상 24자 이하로 입력해주세요."
              }
            />
          </div>
        </Popup>
      </form>
    </div>
  );
};
