export const Step = ({
  label,
  step,
  focus,
}: {
  label: string;
  step: number;
  focus?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`${
          focus ? "bg-[#101010]" : "bg-[#ccc]"
        } rounded-full w-12 h-12 flex items-center text-white font-bold text-[20px] justify-center`}
      >
        {step}
      </div>
      <span
        className={`text-[#ccc] mt-2 text-[14px] ${
          focus && "font-bold !text-[#101010]"
        }`}
      >
        {label}
      </span>
    </div>
  );
};
