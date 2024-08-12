import Image from "next/image";

export const Switch = ({
  value,
  onChange,
  label,
}: {
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) => {
  return (
    <div className="flex items-center">
      <Image
        className="cursor-pointer"
        onClick={() => {
          onChange(!value);
        }}
        src={value ? "/switch-on.png" : "/switch-off.png"}
        alt="Switch"
        width={40}
        height={20}
      />
      {!!label && <label className="ml-3 ">{label}</label>}
    </div>
  );
};
