"use client";

import { useFileUpload } from "@/hooks/use-file-upload";
import "@toast-ui/editor/dist/toastui-editor.css";

import { Editor } from "@toast-ui/react-editor";
import { RefObject, useCallback, useEffect } from "react";

export const QuillEditor = ({
  initialValue,
  editorRef,
}: {
  initialValue: string | null | undefined;
  editorRef: RefObject<Editor>;
}) => {
  const fileUpload = useFileUpload();

  const handleImage = useCallback(
    async (blob: File, callback: (url: string, text?: string) => void) => {
      fileUpload.uplaod(blob).then(({ fileId, key }) => {
        callback(`${process.env.NEXT_PUBLIC_CDN_URL}/${key}`, key);
      });
      return false;
    },
    []
  );

  useEffect(() => {
    editorRef.current?.getInstance().setHTML(initialValue || "");
  }, [initialValue]);

  useEffect(() => {
    editorRef.current
      ?.getInstance()
      .addCommand("wysiwyg", "addYoutube", (payload, state, dispatch, view) => {
        let url = prompt("추가할 youtube 영상의 동영상 ID를 입력해 주세요.");
        if (!url) return false;
        const str = `<iframe src="https://www.youtube.com/embed/${url}"  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>`;
        editorRef.current
          ?.getInstance()
          .setHTML(editorRef.current?.getInstance().getHTML() + "" + str, true);
        return true;
      });

    editorRef.current?.getInstance().insertToolbarItem(
      { groupIndex: 3, itemIndex: 3 },
      {
        name: "youtube",
        text: "Youtube",
        style: { width: "80px" },
        command: "addYoutube",
      }
    );
  }, []);

  return (
    <div className="relative">
      <Editor
        ref={editorRef}
        initialValue={initialValue || ""}
        previewStyle="vertical"
        height="400px"
        initialEditType="wysiwyg"
        hooks={{
          addImageBlobHook: handleImage,
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
                    style: "width: 100%; height: 400px;",
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
                      style: "width: 100%; height: 400px;",
                    },
                  }
                : { type: "closeTag", tagName: "big" };
            },
          },
        }}
      />
    </div>
  );
};

/** customHTMLRenderer={{
          htmlBlock: {
            iframe(node) {
              return [
                {
                  type: "openTag",
                  tagName: "iframe",
                  outerNewLine: true,
                  attributes: node.attrs,
                },
                { type: "html", content: node.childrenHTML ?? "" }, // 여기 반드시 string이어야 한다
                { type: "closeTag", tagName: "iframe", outerNewLine: true },
              ];
            },
          },
          htmlInline: {
            big(node, { entering }) {
              return entering
                ? { type: "openTag", tagName: "big", attributes: node.attrs }
                : { type: "closeTag", tagName: "big" };
            },
          },
        }} */
