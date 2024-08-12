import { Button, ButtonProps } from "./button";

interface ButtonsProps {
  buttons: ({ text: string } & ButtonProps)[];
}

export const Buttons = ({ buttons }: ButtonsProps) => {
  return (
    <div className="flex items-center self-stretch">
      {buttons.map((x, i) => {
        return (
          <Button
            key={i}
            {...x}
            className={`flex-1 ${i > 0 && "ml-2"} ${
              x.onClick && !x.variation && "bg-[#ccc]"
            }`}
            type={x.onClick ? "button" : "submit"}
          >
            {x.text}
          </Button>
        );
      })}
    </div>
  );
};
