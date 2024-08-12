"use client";

import { InputLabel } from "@/components/input-label";
import { QuillViewer } from "@/components/quill-viewer";
import { useLang } from "@/hooks/use-lang";
import { formatDate, getCDNUrl } from "@/utils";
import { apiClient } from "@hackathon-qrmenu/api-client";
import { Content } from "@hackathon-qrmenu/type";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function ContentPreview({
  contentId,
  onClose,
}: {
  contentId: number;
  onClose: () => void;
}) {
  const langCode = useLang();

  const getContent = useSWR(
    {
      url: `/contents/${contentId}`,
      params: { langCode },
    },
    (arg) =>
      apiClient.get<{ content: Content }>(arg.url, {
        params: arg.params,
      })
  );

  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (getContent.data?.data.content?.thumbnail.key) {
      const img = new Image();

      img.onload = function () {
        setImageSize({ width: img.width, height: img.height });
      };

      img.src = getCDNUrl(getContent.data?.data.content?.thumbnail.key);
    }
  }, [getContent.data]);

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 bg-[rgba(0,0,0,0.5)] z-50 flex">
      <div className="m-auto bg-white border-[1px] border-[#ccc] p-5 w-[390px] flex flex-col z-50 h-full max-h-[844px] max-[1440px]:max-h-[calc(100%_-_40px)] overflow-y-auto">
        <div className="flex items-center justify-between">
          <InputLabel label="미리보기" labelBold />
          <button
            type="button"
            onClick={() => {
              onClose();
            }}
            className="flex w-6 h-6"
          >
            <NextImage
              src="/close.png"
              width={12}
              height={12}
              alt="CLose"
              className="m-auto"
            />
          </button>
        </div>
        <p className="text-[14px] mt-5">
          {getContent.data?.data.content.translate.title}
        </p>

        <span className="text-[12px] self-end flex items-center">
          <span className="text-[12px] flex items-center">
            <NextImage
              src="/view.png"
              alt="View"
              width={14}
              height={12}
              className="mr-1"
            />
            {getContent.data?.data.content.views}
          </span>

          <span className="ml-3">
            {formatDate(getContent.data?.data.content.createdAt || "")}
          </span>
        </span>

        {getContent.data?.data.content?.thumbnail.key && (
          <div
            className="relative w-full h-auto mt-2.5"
            style={{
              height: imageSize.height * (350 / imageSize.width),
            }}
          >
            <NextImage
              src={getCDNUrl(getContent.data?.data.content?.thumbnail.key)}
              alt="Test"
              fill
              objectFit="contain"
            />
          </div>
        )}

        <div className="mt-2.5">
          {getContent.data && (
            <QuillViewer
              html={
                getContent.data?.data.content?.translate?.descriptionHtml || ""
              }
            />
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-[500px] relative">
      <div className="bg-white">
        <div className="flex flex-col p-4">
          <h1 className="text-[24px] font-extrabold">
            {getContent.data?.data.content?.translate?.title}
          </h1>

          <div className="mt-3 self-end flex items-center">
            <span className="text-[#999] text-[12px]">
              {formatDate(getContent.data?.data.content?.createdAt || "")}
            </span>
            <span className="text-[#666] text-[12px] flex items-center ml-3">
              <NextImage
                src="/view.png"
                alt="View"
                width={14}
                height={12}
                className="mr-1"
              />
              {getContent.data?.data.content?.views || 0}
            </span>
          </div>
        </div>

        {getContent.data?.data.content?.thumbnail.key && (
          <div
            className="relative w-full h-auto"
            style={{
              height: imageSize.height * (500 / imageSize.width),
            }}
          >
            <NextImage
              src={getCDNUrl(getContent.data?.data.content?.thumbnail.key)}
              alt="Test"
              fill
              objectFit="contain"
            />
          </div>
        )}

        <div className="m-4">
          {getContent.data && (
            <QuillViewer
              html={
                getContent.data?.data.content?.translate?.descriptionHtml || ""
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
