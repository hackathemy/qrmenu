import { Drawer } from "@/components/drawer";
import { LangPopup } from "@/components/lang-popup";
import { Nav } from "@/components/nav";
import { ReactNode } from "react";

export default function ConsoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col">
      <Nav />
      <div className="flex mt-[60px]">
        <Drawer />
        {children}
        <LangPopup />
      </div>
    </div>
  );
}
