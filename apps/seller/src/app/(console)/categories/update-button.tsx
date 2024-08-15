"use client";

import { Input } from "@/components/input";
import { Popup } from "@/components/popup";
import { Radio } from "@/components/radio";
import { Row } from "@/components/row";
import { useLang } from "@/hooks/use-lang";
import { getLangCodeLabel } from "@/utils";
import { apiClient } from "@hackathemy-qrmenu/api-client";
import { useLangPopupStore, useSellerStore } from "@hackathemy-qrmenu/store";
import { Category, LangCode } from "@hackathemy-qrmenu/type";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWRMutation from "swr/mutation";

interface Request {
  isPrivate: "0" | "1";
  name: string;
}

export const UpdateButton = ({
  onAdd,
  onClose,
  category,
}: {
  category: Category | null;
  onClose: () => void;
  onAdd: () => void;
}) => {
  const lang = useLang();
  const sellerId = useSellerStore((s) => s.seller?.id);

  const form = useForm<Request>({
    defaultValues: {
      isPrivate: "1",
      name: "",
    },
  });

  useEffect(() => {
    if (category) {
      form.setValue("isPrivate", category.isPrivate ? "1" : "0");
      form.setValue("name", category.translate.name);
    }
  }, [category]);

  const { trigger, isMutating } = useSWRMutation(
    category ? `/menu/categories/${category.id}` : `/menu/categories`,
    (url, payload: { arg: any }) =>
      category
        ? apiClient.patch(url, payload.arg)
        : apiClient.post(url, payload.arg)
  );

  const show = useLangPopupStore((s) => s.show);

  return (
    <form
      onSubmit={form.handleSubmit(async (values) => {
        if (isMutating) return;

        if (!values.name) return alert("카테고리명을 입력해 주세요.");
        show((withTranslate, f) => {
          onClose();
          trigger(
            !category
              ? {
                  sellerId,
                  isPrivate: values.isPrivate === "1",
                }
              : {
                  category: {
                    isPrivate: values.isPrivate === "1",
                  },
                  langCode: lang,
                  updateMask: "isPrivate",
                }
          )
            .then(({ data }) => {
              apiClient
                .patch(
                  `/menu/categories/${data.category.id}/translate/${data.category.translate.id}`,
                  {
                    translate: { name: values.name },
                    withTranslate,
                    updateMask: "name",
                  }
                )
                .then(() => {
                  onAdd();
                  f();
                })
                .catch(() => {
                  f();
                  alert("저장 실패했습니다.");
                });
            })
            .catch((e) => {
              f();
              alert("저장 실패했습니다.");
            });
        });
      })}
    >
      <Popup confirmLabel="저장" onCancel={onClose}>
        <div className="grid gap-y-3">
          {category && (
            <Row
              large
              label={`카테고리명(${getLangCodeLabel(
                category.translate.langCode
              )})`}
              content={category.translate.name}
            ></Row>
          )}

          <Row
            large
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
            large
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
