export const TabsMin = ({
  tabs,
  index,
  onIndexChange,
}: {
  tabs: string[];
  index: number;
  onIndexChange: (index: number) => void;
}) => {
  return (
    <div className="flex items-center border-b-[1px] border-[#eee] ">
      {tabs.map((tab, i) => {
        const selected = index === i;

        return (
          <button
            type="button"
            key={i}
            onClick={() => {
              onIndexChange(i);
            }}
            className={`py-3 px-10 text-[16px]/[20px] text-[#999] ${
              selected &&
              "border-b-[2px]  !border-[#000] !text-[#000] font-bold"
            }`}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
