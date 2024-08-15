"use client";

import { LangCode, OptionGroup } from "@hackathemy-qrmenu/type";
import { MenuOption } from "./menu-option";
import { MenuOptionItem } from "./menu-option-item";
import { useFieldArray, useFormContext } from "react-hook-form";
import { MenuForm } from "@/app/(shop)/products/[id]/page";
import { MenuOptionMultiple } from "./menu-option-multiple";
import { MenuOptionMultipleItem } from "./menu-option-multiple-item";
import { QuantityManage } from "./quantity-manage";

export const ProductOptions = () => {
  const form = useFormContext<MenuForm>();
  const { fields, update } = useFieldArray({
    control: form.control,
    name: `optionGroups`,
  });

  return (
    <>
      {fields.map(
        (x, i) =>
          x.isRequired && (
            <MenuOption
              option={
                x.translate.langCode === LangCode.KO
                  ? x.translate?.name
                  : x.translate?.name + "(" + x.translateKR?.name + ")"
              }
              required
              key={x.id}
            >
              {x.items.map((z, y) => {
                const selected =
                  form.watch(`optionGroups.${i}.items.${y}.selected`) || false;

                return (
                  <MenuOptionItem
                    onClick={() => {
                      const originGroup = form.getValues(`optionGroups.${i}`);

                      update(i, {
                        ...originGroup,
                        items: originGroup.items.map((z2) => ({
                          ...z2,
                          selected: z2.id === z.id,
                        })),
                      });
                    }}
                    name={z.translate?.name}
                    unit={z.unit}
                    key={z.id}
                    weight={z.weight}
                    price={z.price}
                    selected={selected}
                    nameKO={z.translateKR?.name || ""}
                  />
                );
              })}
            </MenuOption>
          )
      )}

      {fields.map(
        (x, i) =>
          !x.isRequired && (
            <MenuOptionMultiple
              optional
              option={
                x.translate.langCode === LangCode.KO
                  ? x.translate.name
                  : x.translate.name + "(" + x.translateKR?.name + ")"
              }
              key={x.id}
            >
              {x.items.map((z, y) => {
                const item = form.watch(`optionGroups.${i}.items.${y}`);
                const selected = item.selected || false;
                return (
                  <MenuOptionMultipleItem
                    onClick={() => {
                      const originGroup = form.getValues(`optionGroups.${i}`);

                      update(i, {
                        ...originGroup,
                        items: originGroup.items.map((z2) => {
                          if (z2.id === z.id) {
                            z2.selected = !z2.selected;
                            z2.quantity = z2.selected ? 1 : undefined;
                          }
                          return z2;
                        }),
                      });
                    }}
                    unit={z.unit}
                    name={z.translate.name}
                    key={z.id}
                    price={z.price}
                    selected={selected}
                    weight={z.weight}
                    nameKO={
                      z.translate.langCode === LangCode.KO
                        ? ""
                        : z.translateKR?.name || ""
                    }
                    quantityComponent={
                      <QuantityManage
                        // disabled={!selected}
                        quantity={item.quantity || 0}
                        quantityMax={
                          item.quantityMultiple ? item.quantityMax : 1
                        }
                        onDecrease={() => {
                          const originGroup = form.getValues(
                            `optionGroups.${i}`
                          );

                          update(i, {
                            ...originGroup,
                            items: originGroup.items.map((z2) => {
                              if (z2.id === z.id) {
                                z2.quantity!--;
                                if (z2.quantity === 0) {
                                  z2.selected = false;
                                }
                              }
                              return z2;
                            }),
                          });
                        }}
                        onIncrease={() => {
                          const originGroup = form.getValues(
                            `optionGroups.${i}`
                          );

                          update(i, {
                            ...originGroup,
                            items: originGroup.items.map((z2) => {
                              if (z2.id === z.id) {
                                z2.selected = true;
                                if (!z2.quantity) {
                                  z2.quantity = 0;
                                }
                                z2.quantity!++;
                              }
                              return z2;
                            }),
                          });
                        }}
                      />
                    }
                  />
                );
              })}
            </MenuOptionMultiple>
          )
      )}
    </>
  );
};
