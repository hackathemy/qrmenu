import { useSellerMenuStore } from "@hackathemy-qrmenu/store";
import Image from "next/image";
import { useEffect, useState } from "react";

export const DotsMenu = ({
  menus,
  id,
  category,
}: {
  category?: boolean;
  id: number;
  menus: { text: string; onClick?: () => void }[];
}) => {
  const selId = useSellerMenuStore((s) => (category ? s.categoryId : s.id));

  const open = selId === id;

  const setId = useSellerMenuStore((s) =>
    category ? s.setCategoryId : s.setId
  );

  useEffect(() => {
    if (open) {
      const l = (e) => {
        setId(null);
      };
      window.addEventListener("click", l);
      return () => {
        window.removeEventListener("click", l);
      };
    }
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        className="w-6 h-6 flex"
        onClick={(e) => {
          setId(id);
          e.stopPropagation();
        }}
      >
        <Image
          src="/dots.png"
          width={16}
          height={16}
          alt="Dots"
          className="m-auto"
        />
      </button>
      {open && (
        <div className="absolute shadow-md rounded-xl border-[1px] border-[#ccc] py-5 grid gap-y-3 z-10 w-[80px] top-2 right-0 bg-white">
          {menus.map((x, i) => {
            return (
              <button
                type="button"
                onClick={() => {
                  setId(null);
                  x.onClick && x.onClick();
                }}
                key={i}
                className="text-[14px]"
              >
                {x.text}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
