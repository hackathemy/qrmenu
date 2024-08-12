import { ReactNode } from "react";
import { Checkbox } from "./checkbox";
import { Select } from "./select";
import { OpenTime, OpenTimeObject } from "@hackathon-qrmenu/type";

const options = Object.values(OpenTime).map((x) => ({ label: x, value: x }));
export const TimeManage = ({
  label,
  value,
  onChange,
  index,
}: {
  index: number;
  label?: ReactNode;
  value: OpenTimeObject;
  onChange: (value: OpenTimeObject) => void;
}) => {
  const handleChange = (key: string, v: string | boolean) => {
    onChange({ ...value, [key]: v });
  };

  return (
    <div className="flex">
      {label && <span className="mr-5 text-[14px] mt-2.5">{label}</span>}
      <div className="flex-1 flex flex-col items-stretch">
        <div className="grid grid-flow-col gap-x-3 items-center">
          <Select
            options={options}
            selectProps={{
              placeholder: "선택",
              value: value.start,
              onChange: (e) => handleChange("start", e.target.value),
            }}
          />
          <Select
            options={options}
            selectProps={{
              placeholder: "선택",
              value: value.end,
              onChange: (e) => handleChange("end", e.target.value),
            }}
          />
          <Checkbox
            inputProps={{
              checked: value.break,
              onChange: (e) => handleChange("break", e.target.checked),
            }}
            label="브레이크 타임"
            id={`break-${index}`}
          />
        </div>
        {value.break && (
          <div className="grid grid-flow-col auto-cols-max gap-x-3 mt-3 items-center">
            <span className="text-[14px]">브레이크 타임</span>
            <Select
              options={options}
              selectProps={{
                placeholder: "선택",
                value: value.breakStart,
                onChange: (e) => handleChange("breakStart", e.target.value),
              }}
            />
            <Select
              options={options}
              selectProps={{
                placeholder: "선택",
                value: value.breakEnd,
                onChange: (e) => handleChange("breakEnd", e.target.value),
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
