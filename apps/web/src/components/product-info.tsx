"use client";

import dynamic from "next/dynamic";

const DynamicViewer = dynamic(() => import("./quill-viewer"), { ssr: false });

export const ProductInfo = ({
  name,
  description,
}: {
  name: string;
  description: string;
}) => {
  return (
    <div className="flex flex-col">
      <span className="font-extrabold text-[24px]">{name}</span>

      <div className="mb-2">
        <DynamicViewer short html={description} />
      </div>
    </div>
  );
};
