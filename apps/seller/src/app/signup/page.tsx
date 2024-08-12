"use client";

import { AuthForm } from "@/components/auth-form";
import { Checkbox } from "@/components/checkbox";
import { Input } from "@/components/input";
import { InputMessage } from "@/components/input-message";
import { validatEmail } from "@/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormValue {
  email: string;
  password: string;
  passwordConfirm: string;
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
}

const defaultValues: FormValue = {
  email: "",
  password: "",
  passwordConfirm: "",

  terms: false,
  privacy: false,
  marketing: false,
};

export default function SignUp() {
  const router = useRouter();

  const form = useForm({ defaultValues });

  const email = form.watch("email");
  const password = form.watch("password");
  const passwordConfirm = form.watch("passwordConfirm");
  const terms = form.watch("terms");
  const marketing = form.watch("marketing");
  const privacy = form.watch("privacy");

  useEffect(() => {
    if (email) {
      if (!validatEmail(email)) {
        form.setError("email", {
          message: "올바른 이메일 형식을 입력해주세요.",
        });
      } else {
        form.clearErrors("email");
      }
    }
  }, [email]);

  const onSubmit = async (value: FormValue) => {
    if (!value.email) {
      return form.setError(
        "email",
        {
          message: "이메일을 입력해 주세요.",
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
    } else if (value.password !== value.passwordConfirm) {
      return form.setError(
        "passwordConfirm",
        {
          message: "비밀번호가 일치하지 않습니다.",
          type: "onChange",
        },
        { shouldFocus: true }
      );
    } else if (!value.privacy || !value.terms) {
      return form.setError("root", {
        message: "약관에 동의해 주세요.",
        type: "onChange",
      });
    }

    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify(value),
    });

    if (res.status >= 400) {
      const resJson = await res.json();
      if (resJson.code === 2) {
        return form.setError("email", {
          message: "이미 사용중인 이메일입니다.",
        });
      }
      return alert("회원가입 실패했습니다. 정보를 다시 확인해 주세요.");
    }

    window.location.replace("/signup/finish");
  };

  return (
    <AuthForm
      title="판매자 계정 생성"
      onBack={router.back}
      buttons={[
        {
          text: "취소",
          onClick: () => {
            router.back();
          },
        },
        { text: "가입하기", disabled: !email || !password || !passwordConfirm },
      ]}
      formProps={{
        onSubmit: form.handleSubmit(onSubmit),
      }}
    >
      <div className="flex items-center mb-5">
        <h3 className="font-bold text-[24px] text-[#333]">개인정보</h3>
      </div>

      <div>
        <Input
          required
          label="계정 ID(이메일)"
          inputProps={{
            placeholder: "이메일을 입력해주세요.",
            ...form.register("email"),
          }}
        />
        <InputMessage error message={form.formState.errors.email?.message} />
      </div>

      <div>
        <Input
          required
          label="비밀번호"
          inputProps={{
            type: "password",
            ...form.register("password"),
            placeholder: "비밀번호를 입력해주세요.",
          }}
        />
        <InputMessage error message={form.formState.errors.password?.message} />
        <InputMessage
          message={
            "영문, 대소문자, 숫자, 특수문자를 3가지 이상으로 조합해 8자 이상 24자 이하로 입력해주세요."
          }
        />
      </div>

      <div>
        <Input
          required
          label="비밀번호 확인"
          inputProps={{
            type: "password",
            ...form.register("passwordConfirm"),
            placeholder: "비밀번호를 입력해주세요.",
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
      <div>
        <div className="bg-[#fafafa] border-[1px] border-[#ddd] rounded-lg grid grid-flow-row auto-rows-auto gap-y-3 p-4">
          <Checkbox
            label="서비스 이용약관 전체 동의하기"
            id="all"
            bold
            inputProps={{
              checked: terms && privacy && marketing,
              onChange: (e) => {
                form.setValue("marketing", e.target.checked);
                form.setValue("terms", e.target.checked);
                form.setValue("privacy", e.target.checked);
              },
            }}
          />
          <div className="flex items-center justify-between">
            <Checkbox
              label="서비스 이용약관(필수)"
              id="a"
              inputProps={{ ...form.register("terms") }}
            />
            <Link
              href={"/#/terms/"}
              target="_blank"
              className="w-6 h-6 flex"
            >
              <Image
                className="m-auto"
                src="/chervon-right.png"
                width={9}
                height={16}
                alt="Chervom"
              />
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <Checkbox
              label="개인정보 수집 이용 동의(필수)"
              id="b"
              inputProps={{ ...form.register("privacy") }}
            />
            <Link
              href={"/#/privacy/"}
              target="_blank"
              className="w-6 h-6 flex"
            >
              <Image
                className="m-auto"
                src="/chervon-right.png"
                width={9}
                height={16}
                alt="Chervom"
              />
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <Checkbox
              label="마케팅 정보 수신 동의(선택)"
              id="c"
              inputProps={{ ...form.register("marketing") }}
            />
          </div>
        </div>
        <InputMessage error message={form.formState.errors.root?.message} />
      </div>
    </AuthForm>
  );
}
