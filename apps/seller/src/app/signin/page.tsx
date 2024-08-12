"use client";

import { AuthForm } from "@/components/auth-form";
import { Input } from "@/components/input";
import { InputMessage } from "@/components/input-message";
import Link from "next/link";
import { useForm } from "react-hook-form";

interface FormValue {
  email: string;
  password: string;
}

const defaultValues: FormValue = {
  email: "",
  password: "",
};

export default function SignIn() {
  const form = useForm({ defaultValues });

  const onSubmit = async (values: FormValue) => {
    const res = await fetch("/api/signin", {
      method: "POST",
      body: JSON.stringify(values),
    });

    if (res.status !== 200) {
      form.setError("root", {
        message:
          "아이디 또는 비밀번호를 잘못 입력했습니다. 입력하신 내용을 다시 확인해주세요.",
        type: "onChange",
      });
    } else {
      window.location.replace("/");
    }
  };

  return (
    <AuthForm
      footerComponent={
        <div className="self-center mt-3 flex items-center">
          <Link className="text-[#333] text-[14px]" href={"/signup"}>
            회원가입
          </Link>
        </div>
      }
      title="로그인"
      buttons={[{ text: "로그인" }]}
      formProps={{
        onSubmit: form.handleSubmit(onSubmit),
      }}
    >
      <Input
        label="계정 ID(이메일)"
        inputProps={{
          placeholder: "이메일을 입력해주세요.",
          ...form.register("email"),
        }}
      />
      <div>
        <Input
          label="비밀번호"
          inputProps={{
            type: "password",
            placeholder: "비밀번호를 입력해주세요.",
            ...form.register("password"),
          }}
        />
        <InputMessage message={form.formState.errors.root?.message} error />
      </div>
    </AuthForm>
  );
}
