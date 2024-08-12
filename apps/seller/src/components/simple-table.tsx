"use client";

import { ReactNode } from "react";

export interface SimpleTableColumn {
  label: ReactNode;
  width?: string | number;
  onOrder?: () => void;

  /** @default center */
  align?: "left" | "right";

  render?: (data: any, index: number) => ReactNode;
  key?: string;
}

export const SimpleTable = ({
  columns,
  data,
  onItemClick,
}: {
  onItemClick?: (item: any, index: number) => void;
  columns: SimpleTableColumn[];
  data: any[];
}) => {
  return (
    <table cellPadding={0} cellSpacing={0} border={0} className="w-full">
      <thead>
        <tr>
          {columns.map((x, i) => {
            return (
              <th
                key={i}
                className={`h-[44px] border-b-[1px] border-[#999]  !text-[#333] text-[16px] text-center font-[400]`}
                style={{ width: x.width || "auto" }}
              >
                <div className={`flex items-center justify-center`}>
                  {x.label}
                </div>
              </th>
            );
          })}
        </tr>
      </thead>
      <tbody>
        {data.map((x, i) => {
          return (
            <tr
              key={i}
              onClick={() => {
                if (onItemClick) {
                  onItemClick(x, i);
                }
              }}
              className={`${onItemClick && "cursor-pointer"}`}
            >
              {columns.map((z, y) => {
                return (
                  <td key={y + "" + i} className="border-b-[1px] border-[#eee]">
                    <div
                      className={`min-h-[44px] py-2 text-[#101010] text-[14px] flex items-center ${
                        z.align === "left"
                          ? "justify-start"
                          : z.align === "right"
                          ? "justify-end"
                          : "justify-center"
                      }`}
                    >
                      {z.key ? x[z.key] : z.render ? z.render(x, i) : "-"}
                    </div>
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
