import { Input } from "@/components/input";
import { InputLabel } from "@/components/input-label";
import { Row } from "@/components/row";
import { Select } from "@/components/select";
import { Tooltip } from "@/components/tooltip";
import Image from "next/image";
import { MenuManage } from "./menu-manage";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Request } from "./page";
import { useSellerStore } from "@hackathon-qrmenu/store";
import uswSWR from "swr";
import { apiClient } from "@hackathon-qrmenu/api-client";
import { LangCode } from "@hackathon-qrmenu/type";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { FileUploader } from "@/components/file-uploader";
import { getCDNUrl } from "@/utils";
import { Drag } from "@/components/drag";

export const MenuInfo = () => {
  const sellerId = useSellerStore((s) => s.seller?.id);
  const form = useFormContext<Request>();

  const { data, isLoading, error } = uswSWR(
    sellerId ? "/menu/categories" : null,
    () =>
      apiClient.get("/menu/categories", {
        params: { sellerId, langCode: LangCode.KO },
      })
  );

  const categoryIds = form.watch("categoryIds");

  const imagesFieldArray = useFieldArray({
    control: form.control,
    name: "images",
  });

  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id") as string;

  useEffect(() => {
    if (categoryId) {
      form.setValue("categoryIds", [...categoryIds, parseInt(categoryId)]);
    }
  }, [categoryId]);

  const border = useMemo(() => <div className="border-b-[1px]" />, []);

  return (
    <div className="mt-10 grid gap-y-10 grid-flow-row auto-rows-max">
      <Row
        large
        label={<InputLabel labelBold label="메뉴명" required />}
        content={
          <div className="w-[600px]">
            <Input
              inputProps={{
                placeholder: "메뉴명을 입력하세요.",
                ...form.register("name"),
              }}
            />
          </div>
        }
      />
      {border}

      <div>
        <Row
          large
          label={
            <div className="flex items-center">
              <InputLabel labelBold label="메뉴 카테고리" required />
              <Tooltip
                message={
                  <>
                    해당 메뉴를 어떤 카테고리에 포함할 것인지 선택하는
                    항목입니다.'+'을 선택하면 카테고리가 추가되고 ‘–’을 선택하면
                    카테고리가 삭제됩니다. 중복선택이 가능합니다
                  </>
                }
              />
            </div>
          }
          content={
            <div className="flex items-center w-[340px]">
              <Select
                options={
                  data?.data?.categories.map((x) => ({
                    label: x.translate.name,
                    value: x.id.toString(),
                  })) || []
                }
                selectProps={{
                  placeholder: "선택",
                  ...form.register("categoryId"),
                }}
                rootClassName="flex-1"
              />

              <button
                className="ml-3 w-6 h-6 flex items-center"
                type="button"
                onClick={(e) => {
                  const categoryId = form.getValues("categoryId");
                  if (categoryId) {
                    form.setValue("categoryIds", [
                      ...categoryIds,
                      parseInt(categoryId),
                    ]);
                    form.setValue("categoryId", "");
                  }
                }}
              >
                <Image
                  src="/add-outline.png"
                  width={24}
                  height={24}
                  className="m-auto"
                  alt="A"
                />
              </button>
            </div>
          }
        />
        <Row
          large
          label={<></>}
          content={
            <div className="grid grid-flow-col gap-x-2 auto-cols-max mt-2">
              {categoryIds.map((x, i) => {
                return (
                  <div
                    className="flex items-center bg-[#f1f1f1] rounded-md p-3"
                    key={i}
                  >
                    <span className="text-[14px]">
                      {data?.data?.categories.find((z) => z.id === x)?.translate
                        ?.name || ""}
                    </span>
                    <button
                      className="ml-5"
                      type="button"
                      onClick={(e) => {
                        form.setValue(
                          "categoryIds",
                          categoryIds.filter((z) => z !== x)
                        );
                      }}
                    >
                      <Image
                        src="/minus-outline.png"
                        width={24}
                        height={24}
                        alt="Minus"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          }
        />
      </div>

      {border}

      <Images />

      {border}

      <MenuManage />
    </div>
  );
};

export const Images = ({}) => {
  const form = useFormContext<Request>();

  const imagesFieldArray = useFieldArray({
    control: form.control,
    name: "images",
  });

  const [rootWidth, setRootWidth] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scroling, setScrolling] = useState(false);

  const scrollWidth = rootWidth - 120 - 12 - (24 + 12) * 2;

  return (
    <div
      className="flex flex-col w-full"
      ref={(ref) => {
        if (ref) {
          setRootWidth(ref.clientWidth);
        }
      }}
    >
      <span className="font-bold">이미지</span>
      <span className="text-[12px] text-[#666] mb-5">
        최대 20장, 드래그하여 순서를 변경할 수 있습니다.
      </span>
      {/**  */}

      <div
        className="flex items-center"
        style={{
          maxWidth: rootWidth,
          width: rootWidth,
        }}
      >
        <FileUploader
          onChange={(e) => {
            if (imagesFieldArray.fields.length === 20)
              return alert("최대 20장까지만 등록할 수 있습니다.");
            imagesFieldArray.append({ type: "local", data: e });
          }}
          file={null}
        >
          {(onUpload) => {
            return (
              <button
                className="mr-3 w-[120px] h-[120px] rounded-md flex items-center justify-center border-[1px] border-[#101010] flex-col"
                type="button"
                onClick={onUpload}
              >
                <Image src="/upload.png" width={24} height={24} alt="Upload" />
                <span className="text-[14px]">이미지 업로드</span>
              </button>
            );
          }}
        </FileUploader>

        <div className="flex items-center">
          <button
            disabled={!scroling}
            type="button"
            className="self-stretch mr-3 flex items-center w-6"
            onClick={() => {
              scrollRef.current?.scrollTo({
                behavior: "smooth",
                left:
                  scrollRef.current.scrollLeft -
                  scrollRef.current.offsetWidth / 2,
              });
            }}
          >
            <Image
              src="/chevron-left.png"
              width={24}
              height={24}
              alt="Chervon"
            />
          </button>
          <div
            className="items-center flex-1 overflow-x-auto flex"
            style={{
              width: scrollWidth,
              maxWidth: scrollWidth,
            }}
            ref={scrollRef}
            onScroll={(e) => {
              if (e.currentTarget.scrollLeft !== 0) {
                setScrolling(true);
              } else {
                setScrolling(false);
              }
            }}
          >
            {imagesFieldArray.fields.map((x, i) => {
              return (
                <Drag
                  id={x.id}
                  key={x.id}
                  move={(i, i2) => {
                    imagesFieldArray.swap(i, i2);
                  }}
                  type="image"
                  index={i}
                >
                  <div className="w-[120px] h-[120px] rounded-md  bg-[#eee] relative overflow-hidden mr-3">
                    <>
                      {x.type === "local" && (
                        <img
                          className="w-full h-full"
                          alt={`Image ${i}`}
                          src={URL.createObjectURL(x.data)}
                        />
                      )}
                      {x.type === "remote" && (
                        <Image
                          fill
                          alt={`Iamge ${i}`}
                          src={getCDNUrl(x.data.key)}
                        />
                      )}
                    </>

                    <div className="absolute right-0 top-0 left-0 h-6 z-20 flex">
                      <div className="flex-1" />
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("해당 이미지를 삭제하시겠습니까?")) {
                            imagesFieldArray.remove(i);
                          }
                        }}
                      >
                        <Image
                          alt="Fill"
                          src={"/del-filled.png"}
                          width={24}
                          height={24}
                        />
                      </button>
                    </div>
                  </div>
                </Drag>
              );
            })}
          </div>
          <button
            type="button"
            disabled={
              !((imagesFieldArray.fields.length + 1) * 120 > scrollWidth)
            }
            className="self-stretch ml-3 flex items-center w-6"
            onClick={() => {
              scrollRef.current?.scrollTo({
                behavior: "smooth",
                left:
                  scrollRef.current.scrollLeft +
                  scrollRef.current.offsetWidth / 2,
              });
            }}
          >
            <Image
              src="/chevron-right.png"
              width={24}
              height={24}
              alt="Chervon"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
