"use client";

import { LangSelector } from "@/components/lang-selector";
import { MenuList } from "@/components/menu-list";
import { Page } from "@/components/page";
import { Select } from "@/components/select";
import { SmallBorderButton } from "@/components/small-border-button";
import { useCategories } from "@/hooks/use-categories";
import { useLang } from "@/hooks/use-lang";
import { LangCode } from "@hackathon/type";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { stringify } from "querystring";
import { useState } from "react";

export default function Menus({}) {
  const langCode = useLang();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category_id") || "";
  const { data } = useCategories(LangCode.KO);
  const pathname = usePathname();
  const router = useRouter();

  const [total, setTotal] = useState(0);

  return (
    <Page label="메뉴 관리" labelRightComponent={<LangSelector />}>
      <div className="flex">
        <div className="w-full max-w-[1100px] mx-auto flex flex-col">
          <div className="flex items-center">
            <span className="text-[20px] font-bold flex items-center">
              메뉴 목록({total}개)
            </span>
            <div className="ml-auto flex items-center">
              <Select
                className="w-[230px]"
                selectProps={{
                  value: categoryId,
                  onChange: (e) => {
                    router.push(
                      `${pathname}?${stringify({
                        ...Object.fromEntries(searchParams),
                        ["category_id"]: e.target.value,
                      })}`
                    );
                  },
                }}
                options={[
                  { label: "전체", value: "" },
                  ...(data?.data?.categories?.map((x) => ({
                    label: x.translate.name,
                    value: String(x.id),
                  })) || []),
                ]}
              />
              {langCode && LangCode.KO && (
                <Link
                  href={"/menus/create?category_id=" + (categoryId || "")}
                  className="ml-3"
                >
                  <SmallBorderButton>메뉴 추가</SmallBorderButton>
                </Link>
              )}
            </div>
          </div>

          <div className="grid gap-y-3 my-5">
            <MenuList
              empty
              key={categoryId}
              onTotalSize={setTotal}
              categoryId={categoryId ? parseInt(categoryId) : undefined}
            />
          </div>
        </div>
      </div>
    </Page>
  );
}
