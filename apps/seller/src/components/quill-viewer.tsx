"use client";

import "@toast-ui/editor/dist/toastui-editor.css";

import { Editor, Viewer } from "@toast-ui/react-editor";
import { useEffect, useRef, useState } from "react";

export const QuillViewer = ({ html }: { html: string }) => {
  const ref = useRef<Viewer>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [html]);
  return (
    <div className="relative">
      {html ? (
        <Viewer key={key} initialValue={html} ref={ref} />
      ) : (
        <span className="text-[#999]">설정한 내용이 없습니다.</span>
      )}
    </div>
  );
};
