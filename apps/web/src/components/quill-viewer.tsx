"use client";

import "@toast-ui/editor/dist/toastui-editor.css";

import { Viewer } from "@toast-ui/react-editor";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

export const QuillViewer = ({
  html,
  expand,
  short,
}: {
  short?: boolean;
  html: string;
  expand?: boolean;
}) => {
  const [key, setKey] = useState(0);
  const [more, setMore] = useState(false);

  const [rootHeight, setRootHeight] = useState(0);
  const [viewerHeight, setViewerHeight] = useState(0);

  const viewerRef = useRef<Viewer>(null);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [html]);

  const elispe =
    (short || (expand && !more)) && rootHeight >= 48 && viewerHeight > 48
      ? "...."
      : "";

  return (
    <div className="relative">
      <div
        ref={(ref) => {
          if (ref) {
            setRootHeight(ref.offsetHeight);
          }
        }}
        className={`relative viewer-compact ${
          short || (expand && !more)
            ? "max-h-[48px] overflow-y-hidden"
            : "max-h-auto pb-4"
        } ![&>p]:my-0 ![&>p]:m-0 transition-all ease duration-300`}
      >
        <Viewer
          key={key}
          initialValue={html}
          ref={(ref) => {
            if (ref) {
              const div = (ref as any).rootEl?.current as HTMLDivElement;
              setViewerHeight(div.scrollHeight);
            }
          }}
          customHTMLRenderer={{
            htmlBlock: {
              iframe(node, context) {
                return [
                  {
                    type: "openTag",
                    tagName: "iframe",
                    outerNewLine: true,
                    attributes: {
                      ...node.attrs,
                      style: "width: 100%; height: 300px;",
                    },
                  },
                  { type: "html", content: node.childrenHTML },
                  { type: "closeTag", tagName: "iframe", outerNewLine: true },
                ];
              },
            },
            htmlInline: {
              big(node, { entering }) {
                return entering
                  ? {
                      type: "openTag",
                      tagName: "big",
                      attributes: {
                        ...node.attrs,
                        style: "width: 100%; height: 300px;",
                      },
                    }
                  : { type: "closeTag", tagName: "big" };
              },
            },
          }}
        />
      </div>

      {expand && (
        <button
          className="flex items-center py-1.5 self-start"
          onClick={() => {
            setMore((prev) => !prev);
          }}
        >
          <span className="text-[#666] text-[12px]">
            {more ? "Less" : "More"}
          </span>
          <Image
            src={more ? "/chervon-up-grey.png" : "/chervon-down-grey.png"}
            className="ml-1"
            width={10}
            height={6}
            alt="Chervon Down"
          />
        </button>
      )}
    </div>
  );
};

export default QuillViewer;
