import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./button";
import {
  formatNumber,
  getCurrencyLabel,
  getLangCodeLabel,
  getUnitLabel,
} from "@/utils";
import { Currency, LangCode, Unit } from "@hackathemy-qrmenu/type";
import { useRate } from "@/hooks/use-rate";
import { useForm } from "react-hook-form";
import { useSettingStore } from "@hackathemy-qrmenu/store";
import { useTranslation } from "react-i18next";

const IMAGE_MAP = {
  [LangCode.ZH_CN]: "/zh.png",
  [LangCode.ZH_TW]: "/zh.png",
  [LangCode.ES_ES]: "/es.png",
  [LangCode.EN]: "/en.png",
  [LangCode.KO]: "/ko.png",
  [LangCode.JA]: "/ja.png",
  [LangCode.MS]: "/ms.png",
  [LangCode.VI]: "/vi.png",
  [LangCode.TH]: "/th.png",
  [LangCode.AR]: "/ar.png",
};

export const Settings = ({}) => {
  const [visible, setVisible] = useState(false);

  const currency = useSettingStore((s) => s.currency);
  const langCode = useSettingStore((s) => s.langCode);
  const unit = useSettingStore((s) => s.unit);

  const setCurrency = useSettingStore((s) => s.setCurrency);
  const setLangCode = useSettingStore((s) => s.setLangCode);
  const setUnit = useSettingStore((s) => s.setUnit);

  const form = useForm({ defaultValues: { currency, langCode, unit } });

  const watchedCurrency = form.watch("currency");

  const { rate, rateKRW } = useRate(watchedCurrency || currency);

  const { t } = useTranslation();

  useEffect(() => {
    if (visible) {
      const listenr = (e) => {
        setVisible(false);
      };

      window.addEventListener("click", listenr);
      return () => {
        window.removeEventListener("click", listenr);
      };
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      form.setValue("langCode", langCode);
      form.setValue("currency", currency);
      form.setValue("unit", unit);
    }
  }, [visible, langCode, currency, unit]);

  const onSubmit = ({ currency, langCode, unit }) => {
    setLangCode(langCode);
    setCurrency(currency);
    setUnit(unit);
    setVisible(false);
  };

  const langs = Object.values(LangCode).map((langCode) => ({
    langCode,
    disabled: false,
  }));

  const curs = Object.values(Currency).map((currency) => ({
    currency,
    disabled: false,
  }));

  return (
    <div
      className="relative"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <button
        onClick={() => {
          setVisible((p) => !p);
        }}
        className={`${
          visible && "!border-b-[0px]"
        } pr-4 pl-3 shadow-sm border-[#666] border-[1px] rounded-md bg-[#333] w-[200px] h-9 flex items-center justify-between`}
      >
        <div className="flex items-center">
          <Image
            src={IMAGE_MAP[langCode]}
            width={20}
            height={20}
            alt="En"
            className="mr-1"
          />
          <span className="text-white font-extrabold text-[12px]">
            {String(langCode).charAt(0).toUpperCase() + langCode.substring(1)} (
            {currency})
          </span>
        </div>

        <Image alt="Down" src="/chervon-down.png" width={10} height={6} />
      </button>

      {visible && (
        <div className="bg-[#333] absolute left-0 right-0 top-[32px] border-[#666] border-b-[1px] border-l-[1px] border-r-[1px] rounded-b-md">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-3 py-4 flex flex-col">
              <h2 className="font-bold text-[16px] text-white">
                {t("settings")}
              </h2>

              <label className="text-white mt-3 mb-2">{t("languages")}</label>
              <select
                className="bg-[#f5f5f5] rounded-[6px] h-10 w-full text-[#333] px-3"
                {...form.register("langCode")}
                style={{
                  appearance: "none",
                  MozAppearance: "none",
                  WebkitAppearance: "none",
                  backgroundImage:
                    'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.7rem top 50%",
                  backgroundSize: "0.65rem auto",
                }}
              >
                {Object.values(LangCode).map((langCode) =>
                  langs.findIndex(
                    (z) => z.langCode === langCode && z.disabled
                  ) >= 0 ? null : (
                    <option
                      key={langCode}
                      value={langCode}
                      disabled={
                        langs.findIndex(
                          (z) => z.langCode === langCode && z.disabled
                        ) >= 0
                      }
                    >
                      {getLangCodeLabel(langCode)}
                    </option>
                  )
                )}
              </select>

              <label className="text-white mt-3 mb-2">{t("currency")}</label>
              <select
                className="bg-[#f5f5f5] rounded-[6px] h-10 w-full text-[#333] px-3"
                {...form.register("currency")}
                style={{
                  appearance: "none",
                  MozAppearance: "none",
                  WebkitAppearance: "none",
                  backgroundImage:
                    'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.7rem top 50%",
                  backgroundSize: "0.65rem auto",
                }}
              >
                {Object.values(Currency).map((currency) =>
                  curs.findIndex(
                    (z) => z.currency === currency && z.disabled
                  ) >= 0 || ["NTD", "VND", "PHP"].includes(currency) ? null : (
                    <option key={currency} value={currency}>
                      {getCurrencyLabel(currency)}
                    </option>
                  )
                )}
              </select>

              <label className="font-extrabold text-white mt-3 mb-2">
                {watchedCurrency} {rate} = {Currency.KRW}{" "}
                {formatNumber(rateKRW)}
              </label>

              <span className="text-white text-[10px]/[13px] before:content-['•'] before:absolute relative before:-left-2 ml-2">
                {t("source")}: {t("kita")}
                <br />
                {t("kita-full")}
              </span>
              <span className="text-white text-[10px]/[13px] mt-2 before:content-['•'] before:absolute relative before:-left-2 ml-2">
                {t("t-c-m-n-b-a")}
              </span>
              <span className="text-white text-[10px]/[13px] before:content-['•'] before:absolute relative before:-left-2 ml-2">
                {t("p-t-i-a-a-r-o")}
              </span>

              <label className="text-white mt-3 mb-2">{t("unit")}</label>
              <select
                className="bg-[#f5f5f5] rounded-[6px] h-10 w-full text-[#333] px-3"
                {...form.register("unit")}
                style={{
                  appearance: "none",
                  MozAppearance: "none",
                  WebkitAppearance: "none",
                  backgroundImage:
                    'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")',
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.7rem top 50%",
                  backgroundSize: "0.65rem auto",
                }}
              >
                {Object.values(Unit).map((unit) => (
                  <option key={unit} value={unit}>
                    {getUnitLabel(unit)}
                  </option>
                ))}
              </select>

              <span className="text-white text-[10px]/[13px] mt-3 before:content-['•'] before:absolute relative before:-left-2 ml-2">
                {t("l-l-c-u-w-b-d-b-d")}
              </span>

              <Button className="mt-3">{t("apply")}</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
