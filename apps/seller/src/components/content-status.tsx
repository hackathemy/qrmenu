import { ContentSection } from "./content-section";
import { Switch } from "./switch";

export const ContentStatus = ({
  isPrivate,
  isSoldOut,
  setIsPrivate,
  setIsSoldOut,
}: {
  isPrivate: "1" | "0";
  isSoldOut: "1" | "0";
  setIsPrivate: (v: "1" | "0") => void;
  setIsSoldOut: (v: "1" | "0") => void;
}) => {
  return (
    <ContentSection title="기본 상태">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px]">공개 설정</span>
        <div className="flex items-center">
          <span
            className={`mr-2 text-[12px] ${isPrivate === "1" && "!text-[#ff0000]"}`}
          >
            {isPrivate === "1" ? "비공개" : "공개"}
          </span>
          <Switch
            value={isPrivate !== "1"}
            onChange={(e) => setIsPrivate(e ? "0" : "1")}
          />
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-[14px]">품절 설정</span>
        <div className="flex items-center">
          <span
            className={`mr-2 text-[12px] ${isSoldOut === "1" && "!text-[#ff0000]"}`}
          >
            {isSoldOut === "1" ? "품절" : "판매"}
          </span>
          <Switch
            value={isSoldOut !== "1"}
            onChange={(e) => setIsSoldOut(e ? "0" : "1")}
          />
        </div>
      </div>
    </ContentSection>
  );
};
