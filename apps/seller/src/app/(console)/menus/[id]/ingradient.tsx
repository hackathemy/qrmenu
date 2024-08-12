import { Button } from "@/components/button";
import { Input } from "@/components/input";
import { InputLabel } from "@/components/input-label";
import { Tooltip } from "@/components/tooltip";
import Image from "next/image";
import { useRef, useState } from "react";

export const Ingradient = ({
  onAdd,
  texts,
}: {
  onAdd: (text: string) => void;
  texts: { label: string; onDelete: () => void }[];
}) => {
  const [text, setText] = useState("");
  const duration = useRef<any>(null);
  return (
    <div className="rounded-xl border-[1px] p-5">
      <InputLabel
        label="재료(Ingredient)"
        required
        labelBold
        labelComponent={
          <Tooltip
            message={
              <>
                음식 재료를 검색창에 입력해 주세요. 자동완성 기능으로 재료
                이름을 입력할 수 있습니다. 목록에 없는 재료는 직접 입력하여
                [추가] 버튼을 누르면 재료 목록에 해당 재료 이름이 추가됩니다.
                추가된 재료는 x 버튼을 누르면 삭제가 가능합니다.
              </>
            }
          />
        }
      />

      <div className="flex items-center my-5">
        <Input
          inputProps={{
            placeholder: "재료를 입력해주세요.",
            className: "w-[400px]",
            value: text,
            onChange: (e) => setText(e.target.value),
            onKeyDown: (e) => {
              if (e.key === "Enter" && text) {
                e.preventDefault();
                if (duration.current) return;
                duration.current = setTimeout(() => {
                  clearTimeout(duration.current);
                  duration.current = null;

                  onAdd(text);
                  setText("");
                }, 300);
              }
            },
          }}
        />
        <Button
          type="button"
          onClick={() => {
            if (text) {
              onAdd(text);
            }
            setText("");
          }}
          className="ml-3 w-[120px]"
        >
          추가
        </Button>
      </div>

      <div className="border-[1px] border-[#ccc] p-5 pb-3 rounded-sm mt-5  flex flex-wrap items-center">
        {texts.map((x, i) => (
          <div
            key={i}
            className="bg-[#fafafa] border-[#ccc] border-[1px] rounded-2xl text-[14px] text-[#999] py-2 px-5 pr-2.5 mr-2 mb-2 flex items-center"
          >
            {x.label}
            <button className="w-6 h-6 flex" type="button" onClick={x.onDelete}>
              <Image
                src="/del.png"
                width={8}
                height={8}
                alt="Del"
                className="m-auto"
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
