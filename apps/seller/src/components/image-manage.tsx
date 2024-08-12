import Image from "next/image";

export const ImageManage = ({}) => {
  return (
    <div className="grid grid-flow-col gap-x-3 auto-cols-max">
      <button className="w-[120px] h-[120px] rounded-md flex items-center justify-center border-[1px] border-[#101010] flex-col">
        <Image src="/upload.png" width={24} height={24} alt="Upload" />
        <span className="text-[14px]">이미지 업로드</span>
      </button>

      <div className="w-[120px] h-[120px] rounded-md  bg-[#eee] relative">
        <button className="absolute right-0 top-0">
          <Image alt="Fill" src={"/del-filled.png"} width={24} height={24} />
        </button>
      </div>
      <div className="w-[120px] h-[120px] rounded-md  bg-[#eee] relative">
        <button className="absolute right-0 top-0">
          <Image alt="Fill" src={"/del-filled.png"} width={24} height={24} />
        </button>
      </div>
      <div className="w-[120px] h-[120px] rounded-md  bg-[#eee] relative">
        <button className="absolute right-0 top-0">
          <Image alt="Fill" src={"/del-filled.png"} width={24} height={24} />
        </button>
      </div>
    </div>
  );
};
