import { formatNumber } from "@/utils";
import { useCurStore } from "@hackathemy-qrmenu/store";
import { Currency } from "@hackathemy-qrmenu/type";
import { useEffect } from "react";

export function useRate(currency: Currency) {
  const data = useCurStore((x) => x.items);
  const setData = useCurStore((x) => x.setItems);
  const setFetching = useCurStore((x) => x.setFetching);

  useEffect(() => {
    if (!data.length && !useCurStore.getState().fetching) {
      setFetching();
      fetch(`/api/currency`)
        .then((res) => res.json())
        .then((data) => {
          setData(
            data.map((x) => {
              let unit = x.cur_unit.replace("(100)", "");
              if (unit === "CNH") {
                unit = "CNY";
              }

              let rate = parseInt(x.bkpr.replace(/,/g, ""));

              if (x.cur_unit.includes("(100)")) {
                rate = rate / 100;
              }

              return {
                unit,
                rate,
              };
            })
          );
        })
        .catch((err) => console.error("faield to fetch currency api", err));
    }
  }, []);

  const rateKRW = data.find((x) => x.unit === currency)?.rate || 1;

  return {
    rate: 1,
    rateKRW,
    cacaulate: (price: number) =>
      formatNumber(parseFloat((price / rateKRW).toFixed(1))),
  };
}
