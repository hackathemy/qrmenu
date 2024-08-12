"use client";

import { Buttons } from "@/components/buttons";
import { ContentMenu } from "@/app/(console)/contents/[id]/content-menu";
import { ContentSection } from "@/components/content-section";
import { FileUploader } from "@/components/file-uploader";
import { Input } from "@/components/input";
import { InputLabel } from "@/components/input-label";
import { Page } from "@/components/page";
import { QuillEditor } from "@/components/quill-editor";
import { SmallBorderButton } from "@/components/small-border-button";
import { Switch } from "@/components/switch";
import { useFileUpload } from "@/hooks/use-file-upload";
import { apiClient } from "@hackathon-qrmenu/api-client";
import { useLangPopupStore, useSellerStore } from "@hackathon-qrmenu/store";
import { Editor } from "@toast-ui/react-editor";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Content, Menu } from "@hackathon-qrmenu/type";
import { useLang } from "@/hooks/use-lang";
import uswSWR from "swr";
import { LangSelector } from "@/components/lang-selector";
import { Modified } from "@/components/modified";
import { getCDNUrl } from "@/utils";
import { Tooltip } from "@/components/tooltip";
import { Popover } from "react-tiny-popover";
import ContentPreview from "./preview";

export interface Request {
  title: string;
  isPrivate: boolean;
  isPin: boolean;
  menus: Menu[];
  thumbnail: File;
  thumbnailRemote?: { key: string; id: number };
}

export default function ContentCreate({}) {
  const router = useRouter();

  const form = useForm<Request>({
    defaultValues: {
      title: "",
      isPrivate: false,
      isPin: false,
      menus: [],
      thumbnail: undefined,
    },
  });

  let { id } = useParams();
  id = id as string;

  const needSetRef = useRef<boolean>(false);

  const create = id === "create";

  const langCode = useLang();

  useEffect(() => {
    needSetRef.current = false;
  }, [langCode]);

  const { data, isLoading, error } = uswSWR(
    !create ? ["/contents/" + id, { langCode }] : null,
    (params) =>
      apiClient.get<{ content: Content }>(params[0], {
        params: params[1],
      })
  );

  const editorRef = useRef<Editor>(null);

  useEffect(() => {
    if (data?.data?.content) {
      if (needSetRef.current) return;

      form.setValue("isPin", data.data.content.isPin);
      form.setValue("isPrivate", data.data.content.isPrivate);
      form.setValue("thumbnailRemote", data.data.content.thumbnail);
      form.setValue("title", data.data.content.translate.title);
      editorRef.current
        ?.getInstance()
        .setHTML(data.data.content.translate.descriptionHtml || "");

      apiClient
        .get(`/contents/${data.data.content.id}/menus`, {
          params: { langCode },
        })
        .then((res) => {
          form.setValue("menus", res.data.menus);
        });
      needSetRef.current = true;
    }
  }, [data, langCode]);

  const sellerId = useSellerStore((s) => s.seller?.id);
  const fileUpload = useFileUpload();

  const onSubmit = async (
    values: Request,
    withTranslate: boolean,
    onSettled: () => void
  ) => {
    const descriptionHtml = editorRef.current?.getInstance().getHTML();

    if (!values.title) {
      alert("제목을 입력해 주세요.");
    } else if (!values.thumbnail && !values.thumbnailRemote) {
      alert("썸네일을 등록해 주세요.");
    } else if (!descriptionHtml) {
      alert("내용을 입력해 주세요.");
    } else {
      try {
        let fileId: number | undefined = undefined;

        if (values.thumbnail) {
          fileId = (await fileUpload.uplaod(values.thumbnail)).fileId;
        }

        let content: Content;

        if (create) {
          content = (
            await apiClient.post(`/contents`, {
              title: values.title,
              descriptionHtml: descriptionHtml,
              thumbnailFileId: fileId,
              isPrivate: values.isPrivate,
              isPin: values.isPin,
              sellerId: sellerId,
            })
          ).data.content;
        } else {
          content = data?.data.content!;

          await apiClient.patch(`/contents/${content.id}/`, {
            content: {
              thumbnail: {
                id: fileId || values.thumbnailRemote?.id,
              },
              isPrivate: values.isPrivate,
              isPin: values.isPin,
            },
            updateMask: "thumbnail,isPrivate,isPin",
          });
        }

        await apiClient.put(`/contents/${content.id}/menus`, {
          menusIds: values.menus.map((x) => x.id),
        });

        apiClient.patch(
          `/contents/${content.id}/translate/${content.translate.id}`,
          {
            translate: {
              title: values.title,
              descriptionHtml: descriptionHtml,
            },
            withTranslate,
            updateMask: "descriptionHtml,title",
          }
        );

        alert("저장 완료되었습니다.");
        if (create) {
          router.back();
        }
      } catch (error: unknown) {
        console.error(error);
        alert("저장 실패했습니다.");
      }
    }

    onSettled();
  };

  const show = useLangPopupStore((s) => s.show);
  const [preview, setPreview] = useState(false);

  const file = form.watch("thumbnail");
  const isPin = form.watch("isPin");
  const isPrivate = form.watch("isPrivate");
  const remote = form.getValues("thumbnailRemote");
  return (
    <Page
      label="콘텐츠"
      labelLeftComponent={
        <button className="w-6 h-6 flex mr-5" onClick={router.back}>
          <Image
            src="/back.png"
            width={9}
            height={16}
            className="m-auto"
            alt="Back"
          />
        </button>
      }
      labelRightComponent={
        !create && (
          <div className="flex items-center max-[1440px]:flex-col max-[1440px]:items-start">
            <SmallBorderButton
              type="button"
              onClick={() => {
                setPreview(true);
              }}
            >
              미리보기
            </SmallBorderButton>
            {preview && (
              <ContentPreview
                onClose={() => {
                  setPreview(false);
                }}
                contentId={parseInt(id)}
              />
            )}

            <div className="mx-2.5">
              <Modified
                translatedAt={
                  data?.data?.content?.translate?.translatedAt || ""
                }
                updatedAt={data?.data?.content?.translate?.updatedAt || ""}
              />
            </div>
            <LangSelector />
          </div>
        )
      }
    >
      <FormProvider {...form}>
        <form
          className="flex flex-col"
          onSubmit={form.handleSubmit((values) => {
            show((w, o) => onSubmit(values, w, o), true);
          })}
        >
          <div className="flex max-[1440px]:flex-col">
            <div className="flex-1 flex flex-col">
              <div className="grid gap-y-10">
                <Input
                  label="게시물 제목"
                  labelBold
                  inputProps={{
                    placeholder: "게시물 제목을 입력하세요.",
                    ...form.register("title"),
                  }}
                />

                <div>
                  <InputLabel
                    label="게시물 썸네일"
                    labelBold
                    labelComponent={
                      <Tooltip
                        message={
                          <>
                            콘텐츠의 썸네일로 노출되는 이미지입니다.
                            <br />
                            형식에 맞지 않는 썸네일 입력 시 업로드한 이미지가
                            제대로 노출이 되지 않을 수 있습니다.
                          </>
                        }
                      />
                    }
                  ></InputLabel>
                  <div className="mb-5 flex flex-col">
                    {[
                      "리스트에서 노출될 썸네일은 업로드하세요. 이미지를 업로드하지 않으면 기본 썸네일 이미지로 노출됩니다.",
                      "썸네일 용량은 10MB 미만이어야 합니다.",
                      "JPG, JPEG, PNG 형식을 사용합니다.",
                    ].map((x, i) => {
                      return (
                        <span
                          key={i}
                          className="text-[12px]/[16px] before:content-['•'] before:absolute relative before:-left-4 ml-6 text-[#666]"
                        >
                          {x}
                        </span>
                      );
                    })}
                  </div>

                  <FileUploader
                    file={null}
                    onChange={(file) => form.setValue("thumbnail", file)}
                  >
                    {(onUpload) => (
                      <div className="flex items-start">
                        <SmallBorderButton
                          className="border-[#101010]"
                          type="button"
                          onClick={onUpload}
                        >
                          <div className="flex items-center">
                            <Image
                              alt="Upload"
                              src="/upload.png"
                              width={24}
                              height={24}
                              className="mr-2.5"
                            />
                            파일 첨부
                          </div>
                        </SmallBorderButton>
                        <div className="ml-5 handle w-[120px] h-[120px] rounded-md  bg-[#eee] relative overflow-hidden">
                          {file ? (
                            <img
                              className="w-full h-full"
                              alt={`Image`}
                              src={URL.createObjectURL(file)}
                            />
                          ) : remote?.key ? (
                            <Image
                              fill
                              alt={`Iamge`}
                              src={getCDNUrl(remote.key)}
                            />
                          ) : null}
                        </div>
                      </div>
                    )}
                  </FileUploader>
                </div>

                <QuillEditor initialValue={""} editorRef={editorRef} />
              </div>
            </div>
            <div className="flex-1 flex flex-col ml-10 max-[1440px]:ml-0 max-[1440px]:mt-10">
              <ContentMenu />

              <div className="mt-5">
                <ContentSection title="기본 상태">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[14px]">공개 설정</span>
                    <div className="flex items-center">
                      <span
                        className={`mr-2 text-[12px] ${
                          isPrivate && "!text-[#ff0000]"
                        }`}
                      >
                        {isPrivate ? "비공개" : "공개"}
                      </span>
                      <Switch
                        value={!isPrivate}
                        onChange={(e) => form.setValue("isPrivate", !e)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[14px]">고정글 설정</span>
                    <div className="flex items-center">
                      <span
                        className={`mr-2 text-[12px] ${
                          isPin && "!text-[#ff0000]"
                        }`}
                      >
                        {isPin ? "사용" : "미사용"}
                      </span>
                      <Switch
                        value={isPin}
                        onChange={(e) => form.setValue("isPin", e)}
                      />
                    </div>
                  </div>
                </ContentSection>
              </div>
            </div>
          </div>

          <div className="ml-auto mt-10 min-w-[260px]">
            <Buttons
              buttons={[
                { text: "취소", onClick: router.back },
                { text: "저장" },
              ]}
            />
          </div>
        </form>
      </FormProvider>
    </Page>
  );
}
