"use client";

import { Input } from "@/components/input";
import { Popup } from "@/components/popup";
import { Radio } from "@/components/radio";
import { Row } from "@/components/row";
import { apiClient } from "@hackathon/api-client";
import { useSellerStore } from "@hackathon/store";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

interface Request {
  isPrivate: "0" | "1";
  name: string;
}

export const AddButton = ({
  onAdd,
  onClose,
}: {
  onClose: () => void;
  onAdd: () => void;
}) => {
  const sellerId = useSellerStore((s) => s.seller?.id);
  const form = useForm<Request>({
    defaultValues: { isPrivate: "1", name: "" },
  });

  const { trigger, isMutating } = useSWRMutation(
    `/menu/categories`,
    (url, payload: { arg: any }) => apiClient.post(url, payload.arg)
  );

  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        if (isMutating) return;

        if (!values.name) return alert("카테고리명을 입력해 주세요.");
        trigger({
          sellerId,
          isPrivate: values.isPrivate === "1",
          name: values.name,
        })
          .then(() => {
            onClose();
            onAdd();
          })
          .catch((e) => {
            alert("추가 저장 실패했습니다.");
          });
      })}
    >
      <Popup confirmLabel="저장" onCancel={onClose}>
        <div className="grid gap-y-3">
          <Row
            label="카테고리명"
            content={
              <Input
                inputProps={{
                  placeholder: "카테고리명을 입력해주세요.",
                  ...form.register("name"),
                }}
              />
            }
          />
          <Row
            label="공개설정"
            content={
              <div className="grid grid-flow-col auto-cols-max gap-x-10">
                <Radio
                  label="비공개"
                  id="pri"
                  inputProps={{
                    ...form.register("isPrivate"),
                    value: "1",
                  }}
                />
                <Radio
                  label="공개"
                  id="pub"
                  inputProps={{
                    ...form.register("isPrivate"),
                    value: "0",
                  }}
                />
              </div>
            }
          />
        </div>
      </Popup>
    </form>
  );
};
