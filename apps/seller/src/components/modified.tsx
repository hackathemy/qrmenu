"use client";

import { formatDatetime } from "@/utils";

export const Modified = ({
  updatedAt,
  translatedAt,
}: {
  updatedAt: Date | string | null;
  translatedAt: Date | string | null;
}) => {
  return (
    <span className="text-[12px] text-[#999] self-end mt-3">
      마지막 수정시간 {formatDatetime(updatedAt)} / 마지막 번역시간{" "}
      {formatDatetime(translatedAt)}
    </span>
  );
};
