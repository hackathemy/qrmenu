"use client";

import Image from "next/image";
import { Settings } from "./settings";
import { useCartStore } from "@hackathon-qrmenu/store";
import { useRouter } from "next/navigation";
import Link from "next/link";

export const Nav = ({ back }: { back?: boolean }) => {
  const router = useRouter();

  const length = useCartStore((s) => s.items.length);

  return (
    <div className="sticky top-0 left-0 right-0 z-30">
      <nav className="bg-black">
        <div className="w-full p-3 flex items-center">
          {back && (
            <button className="w-8 h-8 flex" onClick={router.back}>
              <Image
                className="m-auto"
                src="/back.png"
                alt="Back"
                width={8}
                height={14}
              />
            </button>
          )}

          <div className="ml-auto grid grid-flow-col auto-cols-auto gap-x-3">
            <Settings />

            <Link href={"/cart"}>
              <button className="shadow-sm border-[#666] border-[1px] rounded-md bg-[#333] w-10 h-9 flex">
                <div className="relative m-auto">
                  <Image src="/cart.png" width={20} height={20} alt="Cart" />
                  {length > 0 && (
                    <span className="absolute bg-[#ff0000] px-1 py-[0.5px] font-extrabold rounded-md text-[#fff] text-[10px]/[12px] text-center -right-1 -top-1">
                      {length}
                    </span>
                  )}
                </div>
              </button>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};
