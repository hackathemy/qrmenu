"use client";

import { MenuOption } from "./menu-option";
import { MenuOptionItem } from "./menu-option-item";
import { useFieldArray, useFormContext } from "react-hook-form";
import { MenuOptionMultiple } from "./menu-option-multiple";
import { MenuOptionMultipleItem } from "./menu-option-multiple-item";
import { QuantityManage } from "./quantity-manage";
import { CartItem } from "@hackathon-qrmenu/store";

export const CartProductOptions = ({index}:{index:number}) => {
  const form = useFormContext<CartItem>();
  const { fields, update } = useFieldArray({
    control: form.control,
    name: `options`,
  });

  return (
    <>
      {fields.map(
        (x, i) =>
          x.isRequired && (
            <MenuOption
              option={x.translate.name + "(" + x.translateKR?.name + ")"}
              required
              key={x.id}
            >
              {x.items.map((z, y) => {
                const selected =
                  form.watch(`options.${i}.items.${y}.selected`) || false;

                return (
                  <MenuOptionItem
                    onClick={() => {
                      const originGroup = form.getValues(`options.${i}`);

                      update(i, {
                        ...originGroup,
                        items: originGroup.items.map((z2) => ({
                          ...z2,
                          selected: z2.id === z.id,
                        })),
                      });
                    }}
                    name={z.translate.name}
                    key={z.id}
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
              option={x.translate.name + "(" + x.translateKR?.name + ")"}
              key={x.id}
            >
              {x.items.map((z, y) => {
                const item = form.watch(`options.${i}.items.${y}`);
                const selected = item.selected || false;
                return (
                  <MenuOptionMultipleItem
                    onClick={() => {
                      const originGroup = form.getValues(`options.${i}`);

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
                    name={z.translate.name}
                    key={z.id}
                    price={z.price}
                    selected={selected}
                    nameKO={z.translateKR?.name || ""}
                    quantityComponent={
                      <QuantityManage
                        disabled={!selected}
                        quantity={item.quantity || 0}
                        quantityMax={
                          item.quantityMultiple ? item.quantityMax : undefined
                        }
                        onDecrease={() => {
                          const originGroup = form.getValues(
                            `options.${i}`
                          );

                          update(i, {
                            ...originGroup,
                            items: originGroup.items.map((z2) => {
                              if (z2.id === z.id) {
                                z2.quantity!--;
                              }
                              return z2;
                            }),
                          });
                        }}
                        onIncrease={() => {
                          const originGroup = form.getValues(
                            `options.${i}`
                          );

                          update(i, {
                            ...originGroup,
                            items: originGroup.items.map((z2) => {
                              if (z2.id === z.id) {
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
