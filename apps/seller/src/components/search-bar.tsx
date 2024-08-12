import Image from "next/image";
import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from "react";

export const SearchBar = ({
  inputProps,
  onSearch,
  onClear,
}: {
  onClear?: () => void;
  onSearch?: () => void;
  inputProps: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
}) => {
  return (
    <div className="h-11 px-5  flex items-center text-[14px]/[20px] border-[1px] border-[#ccc] rounded-sm bg-[#fafafa] w-full max-w-[600px]">
      <input
        {...inputProps}
        className="h-full bg-transparent placeholder:text-[#999999] text-black flex-grow focus:outline-none"
      />
      <button className="w-4.5 h-4.5 mx-5" onClick={onClear}>
        <Image src="/del.png" width={12} height={12} alt="Del" />
      </button>

      <button className="w-4.5 h-4.5" onClick={onSearch}>
        <Image src="/search.png" width={18} height={18} alt="Search" />
      </button>
    </div>
  );
};
