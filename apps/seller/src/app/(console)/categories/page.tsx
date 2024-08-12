"use client";

import { LangSelector } from "@/components/lang-selector";
import { Page } from "@/components/page";
import { CategoryList } from "./category-list";
import { BestMenuList } from "./best-menu-list";

export default function Categories({}) {
  return (
    <Page label="카테고리 관리" labelRightComponent={<LangSelector />}>
      <div className="flex max-[1440px]:flex-col">
        <div className="w-[400px] mr-10 flex flex-col max-[1440px]:w-full max-[1440px]:mr-0">
          <CategoryList />
        </div>
        <div className="flex-1">
          <BestMenuList />
        </div>
      </div>
    </Page>
  );
}
