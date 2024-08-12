export const Tabs = ({
  tabs,
  index,
  onIndexChange,
}: {
  tabs: string[];
  index: number;
  onIndexChange: (index: number) => void;
}) => {
  return (
    <div className="flex items-center self-stretch border-b-[#ddd] border-b-[1px]">
      {tabs.map((tab, i) => {
        const selected = index === i;

        return (
          <button
          type="button"
            key={i}
            onClick={() => {
              onIndexChange(i);
            }}
            className={`py-3 px-20 text-[20px]/[28px] text-[#666] rounded-t-xl ${
              selected && "!bg-[#000] !text-[#fff] font-bold"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
