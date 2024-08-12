"use client";

import { InputLabel } from "@/components/input-label";
import { QuillViewer } from "@/components/quill-viewer";
import { useLang } from "@/hooks/use-lang";
import { formatDate, getCDNUrl } from "@/utils";
import { apiClient } from "@hackathon/api-client";
import { Content } from "@hackathon/type";
import NextImage from "next/image";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function Preview({
  html,
  onClose,
}: {
  html: string;
  onClose: () => void;
}) {
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
        <div className="mt-2.5">
          <QuillViewer html={html} />
        </div>
      </div>
    </div>
  );
}
