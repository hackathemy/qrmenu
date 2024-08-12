"use client";

import { Buttons } from "@/components/buttons";
import { DotsMenu } from "@/components/dots-menu";
import { Input } from "@/components/input";
import { LangSelector } from "@/components/lang-selector";
import { Page } from "@/components/page";
import { Pagination } from "@/components/pagination";
import { Select } from "@/components/select";
import { Table } from "@/components/table";
import { useLang } from "@/hooks/use-lang";
import { useParamsWithPagination } from "@/hooks/use-params-with-pagination";
import { formatDate, getCDNUrl } from "@/utils";
import { apiClient } from "@hackathon-qrmenu/api-client";
import { useSellerStore } from "@hackathon-qrmenu/store";
import { Content, LangCode } from "@hackathon-qrmenu/type";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";

interface Request {
  pageOffset: number;
  pageLimit: number;
  isPrivate: "0" | "1" | "";
  text: string;
  sellerId: number | undefined;
  langCode: LangCode;
}

export default function Contents({}) {
  const router = useRouter();

  const sellerId = useSellerStore((s) => s.seller?.id);

  const langCode = useLang();

  const { params, setPageOffset, form, onSearch } =
    useParamsWithPagination<Request>({
      pageOffset: 0,
      pageLimit: 10,
      isPrivate: "",
      text: "",
      sellerId,
      langCode,
    });

  const { mutate } = useSWRConfig();

  const { data, isLoading, error } = useSWR(
    sellerId ? ["/contents", params] : null,
    ([url, params]) =>
      apiClient.get<{ totalSize: number; contents: Content[] }>(url, { params })
  );

  if (error || isLoading || !data?.data) return null;

  return (
    <Page label="콘텐츠" labelRightComponent={<LangSelector />}>
      <div className="flex flex-col">
        <div className="flex items-center justify-between max-[1440px]:flex-col max-[1440px]:items-start">
          <h2 className="font-bold text-[24px] max-[1440px]:mb-5">게시글 목록</h2>

          <form
            onSubmit={form.handleSubmit((values) => {
              onSearch();
            })}
          >
            <div className="grid grid-flow-col gap-x-3 min-w-[700px]">
              <Select
                options={[
                  { label: "전체", value: "" },
                  { label: "비공개", value: "1" },
                  { label: "공개", value: "0" },
                ]}
                selectProps={{
                  ...form.register("isPrivate"),
                }}
              />
              <Input
                inputProps={{
                  placeholder: "검색어를 입력해주세요.",
                  ...form.register("text"),
                }}
              />
              <Buttons
                buttons={
                  langCode === LangCode.KO
                    ? [
                        {
                          className: "w-[120px]",
                          text: "검색",
                        },
                        {
                          text: "추가",
                          onClick: () => {
                            router.push("/contents/create");
                          },
                          variation: "border",
                          className: "w-[120px]",
                        },
                      ]
                    : [
                        {
                          className: "w-[120px]",
                          text: "검색",
                        },
                      ]
                }
              />
            </div>
          </form>
        </div>

        <div className="mt-5">
          <Table
            columns={[
              {
                label: "No.",
                width: 60,
                render: (item: Content, index) => {
                  if (item.isPin) {
                    return (
                      <Image src="/pin.png" width={12} height={20} alt="Pin" />
                    );
                  }
                  return data?.data.totalSize - params.pageOffset - index;
                },
              },
              {
                label: "제목",
                className: "w-[70%] max-[1440px]:w-[40%]",
                align: "left",
                render: (x: Content) => {
                  return (
                    <div className="flex items-center">
                      <div className="bg-[#eee] w-[112px] h-[90px] relative rounded-lg overflow-hidden">
                        <Image
                          src={getCDNUrl(x.thumbnail.key)}
                          alt="THhumb"
                          fill
                        />
                      </div>
                      <Link
                        href={`/contents/${x.id}`}
                        className="ml-5 font-bold text-[20px]"
                      >
                        {x.translate.title}
                      </Link>
                    </div>
                  );
                },
              },
              {
                label: "상태",
                render: (x: Content, i) => (
                  <span className={x.isPrivate ? "text-[#ff0000]" : ""}>
                    {x.isPrivate ? "비공개" : "공개"}
                  </span>
                ),
              },
              {
                label: "생성날짜",
                render: (x: Content) => formatDate(x.createdAt),
              },
              { label: "조회수", key: "views" },
              {
                label: "",
                width: 50,
                render: (x: Content) => {
                  return (
                    <DotsMenu
                    id={x.id}
                      menus={[
                        {
                          text: x.isPrivate ? "공개" : "비공개",
                          onClick: () => {
                            apiClient
                              .patch(`/contents/${x.id}`, {
                                content: {
                                  isPrivate: !x.isPrivate,
                                },
                                updateMask: "isPrivate",
                              })
                              .then(() => {
                                mutate(["/contents", params]);
                              })
                              .catch((e) => alert("변경 실패했습니다."));
                          },
                        },
                        {
                          text: x.isPin ? "고정글 해제" : "고정글",
                          onClick: () => {
                            apiClient
                              .patch(`/contents/${x.id}`, {
                                content: {
                                  isPin: !x.isPin,
                                },
                                updateMask: "isPin",
                              })
                              .then(() => {
                                mutate(["/contents", params]);
                              })
                              .catch((e) => alert("변경 실패했습니다."));
                          },
                        },
                        {
                          text: "편집",
                          onClick: () => {
                            router.push("/contents/" + x.id);
                          },
                        },
                        {
                          text: "삭제",
                          onClick: () => {
                            if (confirm("정말 삭제하시겠습니까?")) {
                              apiClient
                                .delete(`/contents/${x.id}`)
                                .then(() => {
                                  mutate(["/contents", params]);
                                })
                                .catch((e) => alert("삭제 실패했습니다."));
                            }
                          },
                        },
                      ]}
                    />
                  );
                },
              },
            ]}
            data={data.data.contents}
            message="콘텐츠가 없습니다."
          />
        </div>

        <Pagination
          totalSize={data.data.totalSize}
          limit={params.pageLimit}
          offset={params.pageOffset}
          onOffsetChange={setPageOffset}
        />
      </div>
    </Page>
  );
}
