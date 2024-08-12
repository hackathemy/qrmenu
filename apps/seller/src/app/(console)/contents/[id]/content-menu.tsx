"use client";

import { MenuItem } from "@/components/menu-item";
import { Popup } from "@/components/popup";
import { SmallBorderButton } from "@/components/small-border-button";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Request } from "./page";
import { MenuList } from "@/components/menu-list";
import { getCDNUrl } from "@/utils";
import { Checkbox } from "@/components/checkbox";
import { Menu } from "@hackathon-qrmenu/type";

export const ContentMenu = ({}) => {
  const form = useFormContext<Request>();

  const [menu, setMenu] = useState(false);

  const menus = form.watch("menus");

  const [tempMenus, setTempMenus] = useState<Menu[]>([]);

  return (
    <div>
      <div
        className={`rounded-xl border-[1px] border-[#eee] p-5 flex flex-col`}
      >
        <div className="flex items-center justify-between">
          <span className="font-bold">관련 메뉴 선택 ({menus.length})</span>
          <SmallBorderButton
            type="button"
            onClick={() => {
              setMenu(true);
              setTempMenus(menus);
            }}
          >
            설정하기
          </SmallBorderButton>
        </div>

        <span className="text-[#666] text-[14px] mt-2.5 mb-4">
          관련 메뉴는 콘텐츠 안에 표시됩니다.
        </span>

        {menus.map((x) => {
          return (
            <MenuItem
              id={x.id}
              small
              content={x.translate?.description || ""}
              src={getCDNUrl(x.images[0]?.image?.key)}
              key={x.id}
              isSoldOut={x.isSoldOut}
              isPrivate={x.isPrivate}
              name={x.translate?.name}
              prcie={
                x.optionGroups.find((x) => x.isDefault)?.items[0].price || 0
              }
            />
          );
        })}
      </div>

      {menu && (
        <Popup
          bigTitle
          title="메뉴 리스트"
          onCancel={() => {
            setMenu(false);
          }}
          onConfirm={() => {
            setMenu(false);
            form.setValue("menus", tempMenus);
          }}
          confirmLabel="저장"
          minWidth="min-w-[750px]"
        >
          <div className="border-t-[1px]">
            <MenuList
              renderCheckbox={(menu, index) => {
                return (
                  <div className="pr-2.5">
                    <Checkbox
                      label=""
                      id={`menu-${menu.id}`}
                      inputProps={{
                        disabled: menu.isSoldOut,
                        checked:
                          tempMenus.findIndex((z) => z.id === menu.id) >= 0,
                        onChange: (e) => {
                          if (e.target.checked) {
                            setTempMenus((prev) => [...prev, menu]);
                          } else {
                            setTempMenus((prev) => [
                              ...prev.filter((x) => x.id !== menu.id),
                            ]);
                          }
                        },
                      }}
                    />
                  </div>
                );
              }}
            />
          </div>
        </Popup>
      )}
    </div>
  );
};
