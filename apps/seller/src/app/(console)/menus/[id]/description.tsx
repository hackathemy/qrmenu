import { InputLabel } from "@/components/input-label";
import { TabsMin } from "@/components/tabs-min";
import { Tooltip } from "@/components/tooltip";
import { ReactNode, RefObject, useState } from "react";
import { Editor } from "@toast-ui/react-editor";
import { QuillEditor } from "@/components/quill-editor";
import { SmallBorderButton } from "@/components/small-border-button";
import Preview from "./preview";

export const Description = ({
  descriptionEditorRef,
  guideEditorRef,
  descriptionHtml,
  guideHtml,
  ingradientComponent,
  create,
}: {
  create?: boolean;
  ingradientComponent: ReactNode;
  descriptionHtml: string;
  guideHtml: string;
  descriptionEditorRef: RefObject<Editor>;
  guideEditorRef: RefObject<Editor>;
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  return (
    <div className="flex flex-col items-stretch">
      {preview !== null && (
        <Preview
          html={preview}
          onClose={() => {
            setPreview(null);
          }}
        />
      )}
      <TabsMin
        tabs={["음식 설명", "재료", "먹는 방법"]}
        index={index}
        onIndexChange={setIndex}
      />

      <div className={`mt-10 flex ${index !== 0 && "hidden"}`}>
        <div className="flex flex-col flex-1">
          <InputLabel
            label="음식 설명(Description)"
            labelBold
            required
            labelComponent={
              <SmallBorderButton
                className="ml-auto"
                onClick={() => {
                  setPreview(descriptionHtml);
                }}
                type="button"
              >
                미리보기
              </SmallBorderButton>
            }
          />
          <QuillEditor
            initialValue={descriptionHtml}
            editorRef={descriptionEditorRef}
          />
        </div>
      </div>

      {index === 1 && <div className="mt-10">{ingradientComponent}</div>}

      <div className={`mt-10 flex ${index !== 2 && "hidden"}`}>
        <div className="flex flex-col flex-1">
          <InputLabel
            label="먹는 방법(How to Eat)"
            labelBold
            labelComponent={
              <div className="flex items-center flex-1">
                <Tooltip
                  message={
                    <>
                      음식을 어떻게 먹는지 설명해 주세요. 동영상 URL 입력 및
                      이미지를 첨부하여 게시물을 작성해 주세요. 미리 보기 화면을
                      통해 어떻게 작성되었는지 확인이 가능합니다.
                    </>
                  }
                />
                <SmallBorderButton
                  className="ml-auto"
                  onClick={() => {
                    setPreview(guideHtml);
                  }}
                  type="button"
                >
                  미리보기
                </SmallBorderButton>
              </div>
            }
          />
          <QuillEditor initialValue={guideHtml} editorRef={guideEditorRef} />
        </div>
      </div>
    </div>
  );
};
