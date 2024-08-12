import { useCartStore } from "@hackathon-qrmenu/store";
import { Menu, OptionGroup } from "@hackathon-qrmenu/type";

export function useCart() {
  const { items, setItems } = useCartStore();

  return {
    items,
    append: (menu: Menu, options: OptionGroup[], quantity: number = 1) => {
      setItems([
        ...items,
        {
          menu,
          quantity,
          checked: true,
          options: options.length
            ? options
            : menu.optionGroups.map((x) => {
                if (x.isDefault) {
                  x.items[0].selected = true;
                }
                return x;
              }),
        },
      ]);
      /** 옵션이 다를 경우가 있기 때문 */
      /*    if (items.findIndex((x) => x.menu.id === menu.id) >= 0) {
          setItems([
            ...items.map((x) => {
              if (x.menu.id === menu.id) {
                x.quantity += quantity;
              }
              return x;
            }),
          ]);
        } else {
      }*/
    },
  };
}
