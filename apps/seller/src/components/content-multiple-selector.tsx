import Image from "next/image";
import { ContentSection } from "./content-section";
import { Select, SelectProps } from "./select";
import { ReactNode, useState } from "react";

export const ContentMultipleSelecor = ({
  title,
  selectProps,
  onAdd,
  items,
  message,
}: {
  message?: ReactNode;
  selectProps: SelectProps;
  title: string;
  onAdd: () => void;
  items: { label: string; onDelete: () => void }[];
}) => {
  return (
    <ContentSection title={title} message={message}>
      <div className="flex items-center">
        <Select {...selectProps} rootClassName="flex-1" />

        <button
          className="ml-3 w-6 h-6 flex items-center"
          type="button"
          onClick={onAdd}
        >
          <Image
            src="/add-outline.png"
            width={24}
            height={24}
            className="m-auto"
            alt="A"
          />
        </button>
      </div>

      <div className="grid gap-y-2 mt-3">
        {items.map((x) => {
          return (
            <div className="flex items-center justify-between" key={x.label}>
              <span className="text-[14px]">{x.label}</span>
              <button type="button" onClick={x.onDelete}>
                <Image
                  src="/minus-outline.png"
                  width={24}
                  height={24}
                  alt="Minus"
                />
              </button>
            </div>
          );
        })}
      </div>
    </ContentSection>
  );
};
