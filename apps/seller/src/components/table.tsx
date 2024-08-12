"use client";

import Image from "next/image";
import { ReactNode } from "react";

export interface TableColumn {
  label: ReactNode;
  width?: string | number;
  onOrder?: () => void;
  className?: string;

  /** @default center */
  align?: "left" | "right";

  render?: (data: any, index: number) => ReactNode;
  key?: string;
}

export const Table = ({
  columns,
  data,
  onItemClick,
  message,
}: {
  message?: string;
  onItemClick?: (item: any, index: number) => void;
  columns: TableColumn[];
  data: any[];
}) => {
  return (
    <>
      <table cellPadding={0} cellSpacing={0} border={0} className="w-full">
        <thead>
          <tr>
            {columns.map((x, i) => {
              return (
                <th
                  key={i}
                  className={`h-[44px] bg-[#f1f1f1] !text-[#333] text-[14px] text-center font-[400] ${x.className}`}
                  style={{ width: x.width || "auto" }}
                >
                  <div
                    onClick={x.onOrder}
                    className={`flex items-center justify-center ${
                      x.onOrder && "cursor-pointer"
                    }`}
                  >
                    {x.label}
                    {!!x.onOrder && (
                      <Image
                        alt="Order"
                        src="/order.png"
                        width={12}
                        height={20}
                        className="ml-2"
                      />
                    )}
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
                    <td
                      key={y + "" + i}
                      className="border-b-[1px] border-[#eee]"
                    >
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
      {!data.length && (
        <div className="w-full flex justify-center items-center">
          <p className="my-8">{message || "해당 내용이 없습니다."}</p>
        </div>
      )}
    </>
  );
};
