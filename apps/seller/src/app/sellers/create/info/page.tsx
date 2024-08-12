"use client";

import { AuthForm } from "@/components/auth-form";
import { Button } from "@/components/button";
import { FileUploader } from "@/components/file-uploader";
import { Input } from "@/components/input";
import { InputLabel } from "@/components/input-label";
import { InputMessage } from "@/components/input-message";
import { Select } from "@/components/select";
import { Tooltip } from "@/components/tooltip";
import { useFileUpload } from "@/hooks/use-file-upload";
import { getSellerTypeLabel } from "@/utils";
import { ApiError, apiClient } from "@hackathon-qrmenu/api-client";
import { useSellerStore } from "@hackathon-qrmenu/store";
import { SellerType } from "@hackathon-qrmenu/type";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

interface FormValue {
  name: string;
  contact: string;
  type: SellerType | null;
  managerPhoneNumber: string;
  companyName: string;
  companyNumber: string;
  ceoName: string;
  ceoPhoneNumber: string;
  address: string;
  addressDetail: string;

  image: File | null;
}

const defaultValues: FormValue = {
  name: "",
  contact: "",
  type: null,
  managerPhoneNumber: "",
  companyName: "",
  companyNumber: "",
  ceoName: "",
  ceoPhoneNumber: "",
  address: "",
  addressDetail: "",
  image: null,
};

export default function SellersCreateInfo() {
  const router = useRouter();
  const form = useForm({ defaultValues });

  const image = form.watch("image");
  const setSeller = useSellerStore((s) => s.setSeller);
  const setExisting = useSellerStore((s) => s.setExisting);

  const fileUpload = useFileUpload();

  const onSubmit = async (value: FormValue) => {
    const {
      name,
      contact,
      type,
      managerPhoneNumber,
      companyName,
      companyNumber,
      ceoName,
      ceoPhoneNumber,
      address,
      addressDetail,
      image,
    } = value;

    if (!name) {
      return form.setError(
        "name",
        { message: "식당명을 입력해 주세요.", type: "onChange" },
        { shouldFocus: true }
      );
    } else if (!type) {
      return form.setError(
        "type",
        { message: "업종을 선택해 주세요.", type: "onChange" },
        { shouldFocus: true }
      );
    } else if (!companyName) {
      return form.setError(
        "companyName",
        { message: "상호명을 입력해 주세요.", type: "onChange" },
        { shouldFocus: true }
      );
    } else if (!companyNumber) {
      return form.setError(
        "companyNumber",
        { message: "사업자등록번호를 입력해 주세요.", type: "onChange" },
        { shouldFocus: true }
      );
    } else if (!image) {
      return form.setError(
        "image",
        { message: "사업자등록증을 첨부해 주세요.", type: "onChange" },
        { shouldFocus: true }
      );
    } else if (!ceoName) {
      return form.setError(
        "ceoName",
        { message: "대표자명을 입력해 주세요.", type: "onChange" },
        { shouldFocus: true }
      );
    }

    try {
      const { fileId } = await fileUpload.uplaod(image);

      const {
        data: { seller },
      } = await apiClient.post("/sellers", {
        name,
        contact,
        type,
        managerPhoneNumber,
        companyName,
        companyNumber,
        ceoName,
        ceoPhoneNumber,
        address,
        addressDetail,
        companyNumberImageFileId: fileId,
      });
      setSeller(seller);
      setExisting(true);
      router.replace("/sellers/create/finish");
    } catch (error: unknown) {
      if (error instanceof Error) {
        return alert(error.message);
      }
      const apiError = error as ApiError;
      console.error(apiError);
      alert("판매자 계정생성 실패했습니다.");
    }
  };

  return (
    <AuthForm
      title="판매자 계정 생성"
      onBack={router.back}
      buttons={[{ text: "사업자회원 계정 생성하기", type: "submit" }]}
      formProps={{
        onSubmit: form.handleSubmit(onSubmit),
      }}
    >
      <h3 className="font-bold text-[24px] text-[#333]">식당정보</h3>

      <div>
        <Input
          required
          label="식당명"
          inputProps={{
            placeholder: "식당명을 입력해주세요.",
            ...form.register("name"),
          }}
        />
        <InputMessage message={form.formState.errors.name?.message} error />
      </div>

      <Input
        label="식당 전화번호"
        inputProps={{
          placeholder: "식당 전화번호를 입력해주세요.",
          ...form.register("contact"),
          type: "number",
        }}
      />

      <div>
        <Select
          required
          label="업종"
          options={Object.values(SellerType).map((x) => ({
            value: x,
            label: getSellerTypeLabel(x),
          }))}
          selectProps={{ placeholder: "전체", ...form.register("type") }}
        />
        <InputMessage message={form.formState.errors.type?.message} error />
      </div>

      <div>
        <Input
          label="연락 가능한 담당자 휴대전화번호"
          labelComponent={
            <Tooltip message="셀러 어드민을 관리하는 담당자의 연락처를 입력해 주세요." />
          }
          inputProps={{
            placeholder: "담당자 전화번호를 입력해주세요.",
            ...form.register("managerPhoneNumber"),
            type: "number",
          }}
        />
        <InputMessage
          message={form.formState.errors.managerPhoneNumber?.message}
          error
        />
      </div>

      <h3 className="font-bold text-[24px] text-[#333]">사업자 정보</h3>

      <div>
        <Input
          required
          label="사업자등록 상호명"
          inputProps={{
            placeholder: "사업자등록 상호명을 입력해주세요.",
            ...form.register("companyName"),
          }}
        />
        <InputMessage
          message={form.formState.errors.companyName?.message}
          error
        />
      </div>

      <div>
        <Input
          required
          label="사업자등록번호"
          inputProps={{
            placeholder: "사업자등록번호를 입력해주세요.",
            type: "number",
            ...form.register("companyNumber"),
          }}
        />
        <InputMessage
          message={form.formState.errors.companyName?.message}
          error
        />
      </div>

      <div className="flex flex-col">
        <InputLabel required label="사업자등록증 이미지" />
        <FileUploader
          onChange={(file) => {
            form.setValue("image", file);
            form.clearErrors("image");
          }}
          file={image}
        >
          {(onUpload) => (
            <Button
              variation="border"
              className="w-full"
              type="button"
              onClick={onUpload}
            >
              파일첨부
            </Button>
          )}
        </FileUploader>

        <span className="text-[10px]/[15px] before:content-['•'] before:absolute relative before:-left-4 ml-6 mt-2">
          10MB 이하의 JPG, JPEG, PNG 파일형식만 가능합니다.
        </span>
        <span className="text-[10px]/[15px] before:content-['•'] before:absolute relative before:-left-4 ml-6">
          주민등록번호 등 개인정보가 보이지 않도록 처리한 뒤 업로드 바랍니다.
        </span>

        <InputMessage message={form.formState.errors.image?.message} error />
      </div>

      <div>
        <Input
          required
          label="사업자등록 대표자명"
          inputProps={{
            placeholder: "사업자등록 대표자명을 입력해주세요.",
            ...form.register("ceoName"),
          }}
        />
        <InputMessage message={form.formState.errors.ceoName?.message} error />
      </div>

      <Input
        label="대표 전화번호"
        inputProps={{
          placeholder: "사업자등록 대표자의 전화번호를 입력해주세요.",
          ...form.register("ceoPhoneNumber"),
          type: "number",
        }}
      />

      <div>
        <Input
          label="사업장 소재지"
          required
          inputProps={{
            placeholder: "사업자등록 사업장 소재지를 입력해주세요.",
            ...form.register("address"),
          }}
        />
        <InputMessage message={form.formState.errors.address?.message} error />
      </div>

      <Input
        label="상세 주소"
        inputProps={{
          placeholder: "상세 주소를 입력해주세요.",
          ...form.register("addressDetail"),
        }}
      />
    </AuthForm>
  );
}
