export const Tabs = ({
  tabs,
  index,
  onChange,
}: {
  tabs: string[];
  index: number;
  onChange: (index: number) => void;
}) => {
  return (
    <div className="w-full flex ">
      {tabs.map((tab, i) => {
        const selected = index === i;

        return (
          <button
            key={i}
            className={`flex-1 flex items-center justify-center h-[42px] text-[#999] font-extrabold text-[16px]/[18px] ${
              selected && "border-b-[2px] border-black h-[41px] !text-black"
            }`}
            onClick={() => {
              onChange(i);
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
