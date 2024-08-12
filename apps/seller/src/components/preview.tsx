export const Preview = ({}) => {
  return (
    <div>
      <span className="font-bold mb-4">미리보기</span>
      <div className="border-[#ccc] border-[1px] mt-5 p-5 flex flex-col w-[390px] min-h-[780px]">
        <span className="text-[14px]">TItle</span>
        <span className="text-[12px] self-end mt-2.5">2023-03-12</span>
        <div className="bg-[#eee] w-full h-[200px] my-2.5"></div>
        <p className="text-[12px]">
          리스트에서 노출될 썸네일은 업로드하세요. 이미지를 업로드하지 않으면
          기본 썸네일 이미지로 노출됩니다. 썸네일 용량은 10MB 미만이어야 합니다.
          JPG, JPEG, PNG 형식을 사용합니다.
        </p>
      </div>
    </div>
  );
};
