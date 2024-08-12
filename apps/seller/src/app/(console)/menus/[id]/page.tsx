"use client";

import { Page } from "@/components/page";
import { Tabs } from "@/components/tabs";
import Image from "next/image";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { MenuInfo } from "./info";
import { ContentStatus } from "@/components/content-status";
import { ContentMultipleSelecor } from "@/components/content-multiple-selector";
import { Description } from "./description";
import { Buttons } from "@/components/buttons";
import { FormProvider, useForm } from "react-hook-form";
import { Menu, MenuAllergy, MenuBadge, MenuFoodStyle } from "@hackathon-qrmenu/type";
import { Editor } from "@toast-ui/react-editor";
import { Ingradient } from "./ingradient";
import useSWRMutation from "swr/mutation";
import { apiClient } from "@hackathon-qrmenu/api-client";
import { useLangPopupStore, useSellerStore } from "@hackathon-qrmenu/store";
import { useLang } from "@/hooks/use-lang";
import uswSWR from "swr";
import {
  getLangCodeLabel,
  getMenuAllergyLabel,
  getMenuBadgeLabel,
  getMenuFoodStyleLabel,
} from "@/utils";
import { LangSelector } from "@/components/lang-selector";
import { useFileUpload } from "@/hooks/use-file-upload";
import { Modified } from "@/components/modified";

export interface Group {
  isRequired: boolean;
  isDefault: boolean;
  isFree: boolean;
  name: string;
  items: {
    price: string;
    weight: string;
    unit: string;
    quantityMultiple: boolean;
    name: string;
    quantityMax: string;
  }[];
}

export interface Request {
  name: string;
  categoryId: string;
  categoryIds: number[];
  isPrivate: "1" | "0";
  isSoldOut: "1" | "0";
  badges: MenuBadge[];
  badge: string;
  groups: Group[];
  foodStyles: MenuFoodStyle[];
  images: (
    | {
        type: "local";
        data: File;
      }
    | {
        type: "remote";
        data: { id: number; key: string };
      }
  )[];
  foodStyle: string;
  allergies: MenuAllergy[];
  allergy: string;
  ingredients: string[];
  descriptionHtml: string;
  guideHtml: string;
}

export default function Menu({}) {
  const { id } = useParams();
  const router = useRouter();
  const create = id === "create";
  const sellerId = useSellerStore((s) => s.seller?.id);
  const [index, setIndex] = useState(0);

  const form = useForm<Request>({
    defaultValues: {
      name: "",
      categoryId: "",
      categoryIds: [],
      ingredients: [],
      isPrivate: "0",
      isSoldOut: "0",
      badges: [],
      groups: [
        {
          isDefault: true,
          isRequired: true,
          isFree: false,
          name: "",
          items: [
            {
              price: "",
              weight: "",
              unit: "g",
              quantityMultiple: false,
              name: "",
              quantityMax: "",
            },
          ],
        },
      ],
      images: [],
      foodStyles: [],
      allergies: [],
      descriptionHtml: "",
      guideHtml: "",
    },
  });

  const langCode = useLang();

  useEffect(() => {
    needSetRef.current = false;
  }, [langCode]);

  const { data, isLoading, error } = uswSWR(
    !create ? ["/menu/menus/" + id, { langCode }] : null,
    (params) =>
      apiClient.get<{ menu: Menu }>(params[0], {
        params: params[1],
      })
  );

  const needSetRef = useRef(false);

  useEffect(() => {
    if (data?.data?.menu) {
      if (needSetRef.current) return;
      form.setValue("name", data.data.menu.translate.name);
      form.setValue("descriptionHtml", data.data.menu.translate.description);
      form.setValue("guideHtml", data.data.menu.translate.guide);

      form.setValue(
        "groups",
        data.data.menu.optionGroups.map((x) => {
          return {
            entityId: x.id,
            ...x,
            name: x.translate.name,
            items: x.items.map((z) => ({
              entityId: z.id,
              ...z,
              name: z.translate?.name,
              quantityMultiple: z.quantityMultiple,
              unit: z.unit,
              price: String(z.price || ""),
              weight: String(z.weight || ""),
              quantityMax: String(z.quantityMax || ""),
            })),
          };
        })
      );

      form.setValue("ingredients", data.data.menu.translate.ingredients);

      form.setValue(
        "categoryIds",
        data.data.menu.categories.map((x) => x.category.id)
      );

      form.setValue("isPrivate", data.data.menu.isPrivate ? "1" : "0");
      form.setValue("isSoldOut", data.data.menu.isSoldOut ? "1" : "0");
      form.setValue("badges", data.data.menu.badges);
      form.setValue("allergies", data.data.menu.allergies);
      form.setValue(
        "images",
        data.data.menu.images.map((x) => ({
          type: "remote",
          data: { key: x.image.key, id: x.image.id },
        })) as any
      );
      form.setValue("foodStyles", data.data.menu.foodStyles);
      needSetRef.current = true;
    }
  }, [data]);

  const descriptionEditorRef = useRef<Editor>(null);
  const guideEditorRef = useRef<Editor>(null);

  const commandMenu = useSWRMutation(
    create ? `/menu/menus` : `/menu/menus/${id}`,
    (api, payload: { arg: any }) =>
      create
        ? apiClient.post<{ menu: Menu }>(api, payload.arg)
        : apiClient.patch<{ menu: Menu }>(api, payload.arg)
  );

  const fileUpload = useFileUpload();

  const loading = useRef(false);
  const onSubmit = async (
    values: Request,
    withTranslate: boolean,
    onSettled: () => void
  ) => {
    if (loading.current) return alert("처리중입니다.");

    loading.current = true;
    const descriptionHtml =
      descriptionEditorRef.current?.getInstance().getHTML() ||
      values.descriptionHtml;
    const guideHtml =
      guideEditorRef.current?.getInstance().getHTML() || values.guideHtml;

    const {
      isPrivate,
      isSoldOut,
      badges,
      foodStyles,
      allergies,
      ingredients,
      categoryIds,
      name,
      groups,
    } = values;

    if (!name) {
      alert("메뉴명을 입력해 주세요.");
    } else if (!categoryIds.length) {
      alert("카테고리를 1개 이상 선택해 주세요.");
    } else if (!descriptionHtml) {
      alert("음식 설명을 입력해 주세요.");
    } else if (!ingredients.length) {
      alert("재료를 1개 이상 등록해 주세요.");
    } else {
      try {
        const params = {
          isPrivate: isPrivate === "1",
          isSoldOut: isSoldOut === "1",
          badges,
          foodStyles,
          allergies,
        };

        const menu = (
          await commandMenu.trigger(
            create
              ? {
                  sellerId,
                  ...params,
                }
              : {
                  menu: params,
                  updateMask: "isPrivate,isSoldOut,badges,foodStyles,allergies",
                  langCode,
                }
          )
        ).data.menu;

        if (!menu) {
          throw new Error("처리할 수 없습니다.");
        }

        await apiClient.put(`/menu/menus/${menu.id}/categories`, {
          categoryIds,
        });

        const images = await Promise.all(
          values.images.map((x) =>
            x.type === "remote"
              ? { fileId: x.data.id, key: x.data.key }
              : fileUpload.uplaod(x.data as File)
          )
        );

        await apiClient.put(`/menu/menus/${menu.id}/images`, {
          imageFileIds: images.map((x) => x.fileId),
        });

        await apiClient.put(`/menu/menus/${menu.id}/options`, {
          groups: groups.map((x: any) => {
            return {
              ...x,
              id: x.entityId,
              items: x.items.map((z: any) => {
                return {
                  ...z,
                  id: z.entityId,
                  price: parseInt(z.price || "0"),
                  quantityMax: parseInt(z.quantityMax || "0"),
                  weight: parseInt(z.weight || "0"),
                };
              }),
            };
          }),
          withTranslate,
          langCode: langCode,
        });

        apiClient.patch(
          `/menu/menus/${menu.id}/translate/${menu.translate.id}`,
          {
            translate: {
              description: descriptionHtml,
              guide: guideHtml,
              ingredients,
              name,
            },
            withTranslate,
            updateMask: "description,guide,ingredients,name",
          }
        );

        // alert(create ? "등록되었습니다." : "수정되었습니다.");

        if (create) {
          router.replace(`/menus/${menu.id}`);
        } else {
          router.refresh();
        }
      } catch (error: unknown) {
        console.error(error);
        // alert(create ? "메뉴 등록 실패했습니다." : "메뉴 수정 실패했습니다.");
      }
      onSettled();
    }
    loading.current = false;
  };

  const allergies = form.watch("allergies");
  const badges = form.watch("badges");
  const foodStyles = form.watch("foodStyles");
  const isPrivate = form.watch("isPrivate");
  const isSoldOut = form.watch("isSoldOut");
  const ingredients = form.watch("ingredients");

  const show = useLangPopupStore((s) => s.show);

  return (
    <FormProvider {...form}>
      <form
        className="w-full"
        onSubmit={form.handleSubmit(
          (values) =>
            !commandMenu.isMutating &&
            show((withTranslate, onSettled) => {
              onSubmit(values, withTranslate, onSettled);
            }, true)
        )}
      >
        <Page
          label="메뉴 관리"
          labelRightComponent={
            !create && (
              <div className="flex items-center max-[1440px]:flex-col">
                <div className="mr-2.5 max-[1440px]:mr-0">
                  <Modified
                    translatedAt={
                      data?.data?.menu?.translate?.translatedAt || ""
                    }
                    updatedAt={data?.data?.menu?.translate?.updatedAt || ""}
                  />
                </div>
                <LangSelector />
              </div>
            )
          }
        >
          <div className="flex items-center mb-10 mt-5">
            <button
              className="w-6 h-6 flex mr-3"
              onClick={router.back}
              type="button"
            >
              <Image
                src="/back.png"
                alt="Back"
                width={9}
                height={16}
                className="m-auto"
              />
            </button>
            <span className="text-[24px] font-bold">
              {create
                ? "메뉴 추가 (한국어)"
                : "메뉴 수정" + " (" + getLangCodeLabel(langCode) + ")"}
            </span>
          </div>

          <Tabs
            tabs={["기본 정보", "음식 설명"]}
            index={index}
            onIndexChange={(index) => {
              if (index === 0) {
                form.setValue(
                  "descriptionHtml",
                  descriptionEditorRef.current?.getInstance().getHTML() || ""
                );

                form.setValue(
                  "guideHtml",
                  guideEditorRef.current?.getInstance().getHTML() || ""
                );
              }

              setIndex(index);
            }}
          />

          <div className="flex max-[1440px]:flex-col items-start">
            <div className="flex-1">
              {index === 0 && <MenuInfo />}
              {index === 1 && (
                <Description
                  create={create}
                  descriptionHtml={form.getValues("descriptionHtml")}
                  guideHtml={form.getValues("guideHtml")}
                  descriptionEditorRef={descriptionEditorRef}
                  guideEditorRef={guideEditorRef}
                  ingradientComponent={
                    <Ingradient
                      onAdd={(x) => {
                        form.setValue("ingredients", [...ingredients, x]);
                      }}
                      texts={ingredients.map((x, i) => ({
                        label: x,
                        onDelete: () => {
                          form.setValue("ingredients", [
                            ...ingredients.filter((_, z) => i !== z),
                          ]);
                        },
                      }))}
                    />
                  }
                />
              )}
            </div>
            <div className="w-[300px] ml-10 grid gap-y-3  mt-10 max-[1440px]:ml-0 max-[1440px]:grid-cols-2 max-[1440px]:w-full max-[1440px]:gap-x-3">
              <ContentStatus
                isPrivate={isPrivate}
                setIsPrivate={(v) => form.setValue("isPrivate", v)}
                isSoldOut={isSoldOut}
                setIsSoldOut={(v) => form.setValue("isSoldOut", v)}
              />
              <ContentMultipleSelecor
                items={badges.map((x) => ({
                  label: getMenuBadgeLabel(x),
                  onDelete: () => {
                    form.setValue("badges", [...badges.filter((z) => z !== x)]);
                  },
                }))}
                onAdd={() => {
                  const value = form.getValues("badge");
                  if (value) {
                    form.setValue("badges", [...badges, value as MenuBadge]);
                    form.setValue("badge", "");
                  }
                }}
                selectProps={{
                  options: Object.values(MenuBadge).map((x) => ({
                    label: getMenuBadgeLabel(x),
                    value: x,
                  })),
                  selectProps: {
                    placeholder: "선택",
                    ...form.register("badge"),
                  },
                }}
                title="배지"
                message={
                  <>
                    인플루언서 추천, 추천, 신상품과 같은 배지를 등록하여 상품을
                    판매할 때 활용해 보세요. '+'을 선택하면 배지 아이콘이
                    추가됩니다. 중복 선택이 가능합니다.
                  </>
                }
              />
              <ContentMultipleSelecor
                items={foodStyles.map((x) => ({
                  label: getMenuFoodStyleLabel(x),
                  onDelete: () => {
                    form.setValue("foodStyles", [
                      ...foodStyles.filter((z) => z !== x),
                    ]);
                  },
                }))}
                onAdd={() => {
                  const value = form.getValues("foodStyle");
                  if (value) {
                    form.setValue("foodStyles", [
                      ...foodStyles,
                      value as MenuFoodStyle,
                    ]);
                    form.setValue("foodStyle", "");
                  }
                }}
                selectProps={{
                  options: Object.values(MenuFoodStyle).map((x) => ({
                    label: getMenuFoodStyleLabel(x),
                    value: x,
                  })),
                  selectProps: {
                    placeholder: "선택",
                    ...form.register("foodStyle"),
                  },
                }}
                title="푸드 스타일"
                message={
                  <>
                    푸드스타일을 등록하여 할랄 음식, 베지테리언 등의 정보를
                    알려주세요. '+'을 선택하면 목록에서 선택한 텍스트가
                    추가됩니다. 중복 선택이 가능합니다.
                    <br />
                    할랄 인증(Halal Certified)
                    <br />
                    이슬람 식품법에서 정한 규정과 원칙에 따라 제조되고 가공된
                    제품 및 식품 서비스
                    <br />
                    베지테리언(Vegetarian) <br />
                    고기를 제외한 모든 음식을 섭취. <br />
                    비건 (Vegan)
                    <br />
                    모든 종류의 동물성 음식 섭취하지 않음
                    <br />
                    락토 (Lacto) 베지테리언
                    <br />
                    유제품 섭취
                    <br />
                    오보 (Ovo) 베지테리언
                    <br />
                    동물의 알 섭취
                    <br />
                    락토-오보 (Lacto-ovo) 베지테리언
                    <br />
                    동물의 알과 유제품 섭취
                    <br />
                    페스코 (Pesco) 베지테리언
                    <br />
                    해산물과 동물의 알, 우유만 섭취
                    <br />
                    폴로 (pollo) 베지테리언
                    <br />
                    붉은 육고기(소, 돼지) 섭취하지 않음
                  </>
                }
              />
              <ContentMultipleSelecor
                items={allergies.map((x) => ({
                  label: getMenuAllergyLabel(x),
                  onDelete: () => {
                    form.setValue("allergies", [
                      ...allergies.filter((z) => z !== x),
                    ]);
                  },
                }))}
                onAdd={() => {
                  const value = form.getValues("allergy");
                  if (value) {
                    form.setValue("allergies", [
                      ...allergies,
                      value as MenuAllergy,
                    ]);
                    form.setValue("allergy", "");
                  }
                }}
                selectProps={{
                  options: Object.values(MenuAllergy).map((x) => ({
                    label: getMenuAllergyLabel(x),
                    value: x,
                  })),
                  selectProps: {
                    placeholder: "선택",
                    ...form.register("allergy"),
                  },
                }}
                title="알레르기"
                message={
                  <>
                    알레르기 정보를 등록하여 식품에 대한 정보를 알려주세요.
                    국가에서 지정한 알레르기를 유발하는 재료들을 선택해서 추가할
                    수 있습니다. +을 선택하면 목록에서 선택한 텍스트가
                    추가됩니다. 중복 선택이 가능합니다.
                    <br />
                    알레르기 일으키는 식품
                    <br />
                    우유
                    <br />
                    메밀
                    <br />
                    밀(밀가루)
                    <br />
                    대두(콩)
                    <br />
                    땅콩
                    <br />
                    잣<br />
                    호두
                    <br />
                    복숭아
                    <br />
                    토마토
                    <br />
                    돼지고기
                    <br />
                    닭고기
                    <br />
                    소고기
                    <br />
                    난류(달걀, 메추리 등)
                    <br />
                    오징어
                    <br />
                    고등어
                    <br />
                    게<br />
                    새우
                    <br />
                    조개류(굴, 홍합, 전복)
                    <br />
                    아황산류
                  </>
                }
              />
            </div>
          </div>

          <div className="border-t-[1px] pt-5 flex justify-end mt-10">
            <div className="w-[300px]">
              <Buttons
                buttons={[
                  {
                    text: "취소",
                    onClick: router.back,
                  },
                  { text: "저장" },
                ]}
              />
            </div>
          </div>
        </Page>
      </form>
    </FormProvider>
  );
}
