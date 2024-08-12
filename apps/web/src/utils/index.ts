import { ApiError } from "@hackathon/api-client";
import {
  AccountStatus,
  Currency,
  LangCode,
  MenuAllergy,
  MenuBadge,
  MenuFoodStyle,
  MenuUnit,
  OpenTimeObject,
  OpenTimeType,
  SellerType,
  Unit,
} from "@hackathon/type";
import dayjs from "dayjs";
import { useMemo } from "react";

export const toImperial = (unit: MenuUnit, weight: number) => {
  switch (unit) {
    case MenuUnit.ML:
      return (
        formatNumber(parseFloat((weight * 0.033814).toFixed(1))) + "fl.oz."
      );
    case MenuUnit.G:
      return formatNumber(parseFloat((weight * 0.035274).toFixed(1))) + "oz";
    case MenuUnit.KG:
      return formatNumber(parseFloat((weight * 2.2046).toFixed(1))) + "lb";
    case MenuUnit.L:
      return formatNumber(parseFloat((weight * 1.05669).toFixed(1))) + "qt";
  }
};

export const wrapError = (cb: (err: ApiError) => void) => (error: unknown) => {
  cb(error as ApiError);
};

export const formatDate = (date: string | Date) =>
  dayjs(date).format("YYYY-MM-DD");
export const formatDatetime = (datetime: Date | string | null) =>
  !datetime ? "" : dayjs(datetime).format("YYYY-MM-DD HH:mm");

const MENU_BADGE_LABEL = {
  [MenuBadge.Influencer]: "인플루언서 추천",
  [MenuBadge.New]: "신상품",
  [MenuBadge.Rec]: "추천",
};

const MENU_FOOD_STYLE_LABEL = {
  [MenuFoodStyle.Began]: "비건",
  [MenuFoodStyle.Halal]: "할랄 인증",
  [MenuFoodStyle.Lacto]: "락토",
  [MenuFoodStyle.LactoOvo]: "락토-오보",
  [MenuFoodStyle.Ovo]: "오보",
  [MenuFoodStyle.Pesco]: "페스코",
  [MenuFoodStyle.Pollo]: "폴로",
  [MenuFoodStyle.Vege]: "베지테리언",
};

const MENU_ALLEGRY_LABEL = {
  [MenuAllergy.Milk]: "우유",
  [MenuAllergy.Buckwheat]: "메밀",
  [MenuAllergy.Wheat]: "밀가루",
  [MenuAllergy.Soybean]: "대두",
  [MenuAllergy.Peanut]: "땅콩",
  [MenuAllergy.Pine]: "잣",
  [MenuAllergy.Walnut]: "호두",
  [MenuAllergy.Peach]: "복숭아",
  [MenuAllergy.Tomato]: "토마토",
  [MenuAllergy.Pork]: "돼지고기",
  [MenuAllergy.Chicken]: "닭고기",
  [MenuAllergy.Beef]: "소고기",
  [MenuAllergy.Eggs]: "난류(달걀, 메추리 등)",
  [MenuAllergy.Squid]: "오징어",
  [MenuAllergy.Mackerel]: "고등어",
  [MenuAllergy.Crab]: "게",
  [MenuAllergy.Shrimp]: "새우",
  [MenuAllergy.Shellfish]: "굴, 홍합, 전복",
  [MenuAllergy.Sulfites]: "아황산류",
};

const LANG_CODE_LABEL = {
  [LangCode.AR]: "العربية",
  [LangCode.EN]: "English",
  [LangCode.ES_ES]: "español",
  [LangCode.JA]: "日本語",
  [LangCode.KO]: "한국어",
  [LangCode.MS]: "Bahasa Melayu",
  [LangCode.TH]: "ภาษาไทย",
  [LangCode.VI]: "Tiếng Việt",
  [LangCode.ZH_CN]: "中文简体",
  [LangCode.ZH_TW]: "中文繁體",
};

const ACCOUNT_STATUS_LABEL = {
  [AccountStatus.ACTIVE]: "사용",
  [AccountStatus.HOLD]: "보류",
  [AccountStatus.PENDING]: "승인전",
  [AccountStatus.REJECTED]: "차단",
};

const SELLER_TYPE_LABEL = {
  [SellerType.KOREAN]: "한식",
  [SellerType.ASIAN]: "아시안",
  [SellerType.AMERICAN]: "양식",
  [SellerType.CHINESE]: "중식",
  [SellerType.JAPANENESE]: "일식",
  [SellerType.JOINFOOD]: "분식",
  [SellerType.ETC]: "기타",
};

const CURRENCY_LABEL = {
  [Currency.AED]: "(درهم إماراتي)AED",
  [Currency.CNY]: "CNY (元)",
  [Currency.EUR]: "EUR (€)",
  [Currency.HKD]: "HKD (HK Dollar)",
  [Currency.JPY]: "JPY (円)",
  [Currency.KRW]: "KRW (원)",
  [Currency.MYR]: "MYR (RM)",
  [Currency.NTD]: "NTD (NT Dollar)",
  [Currency.PHP]: "PHP (P)",
  [Currency.SGD]: "SGD (S Dollar)",
  [Currency.THB]: "THB",
  [Currency.USD]: "USD(US Dollar)",
  [Currency.VND]: "VND (₫)",
};

const UNIT_LABEL = {
  [Unit.Imperial]: "Imperial",
  [Unit.Metric]: "Metric",
};

export const getMenuBadgeLabel = (code: MenuBadge) => {
  return MENU_BADGE_LABEL[code];
};
export const getMenuFoodStyleLabel = (code: MenuFoodStyle) => {
  return MENU_FOOD_STYLE_LABEL[code];
};
export const getMenuAllergyLabel = (code: MenuAllergy) => {
  return MENU_ALLEGRY_LABEL[code];
};

export const getLangCodeLabel = (code: LangCode) => {
  return LANG_CODE_LABEL[code];
};

export const getAccountStatusLabel = (code: AccountStatus) => {
  return ACCOUNT_STATUS_LABEL[code];
};

export const getSellerTypeLabel = (code: SellerType) => {
  return SELLER_TYPE_LABEL[code];
};

export const getCurrencyLabel = (code: Currency) => {
  return CURRENCY_LABEL[code];
};

export const getUnitLabel = (code: Unit) => {
  return UNIT_LABEL[code];
};

export const formatNumber = (price: number) =>
  !price ? "0" : price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const getCDNUrl = (key: string) =>
  `${process.env.NEXT_PUBLIC_CDN_URL}/${key}`;

export function useDefaultQueryParams<T extends { [key in string]: any }>(
  searchParams: URLSearchParams,
  defaultParams?: T
): T {
  const params = useMemo((): T => {
    const data = {
      ...defaultParams,
      ...Object.fromEntries(searchParams.entries()),
    } as T;

    Object.keys(data).map((key) => {
      if (data[key] === undefined || data[key] === null) {
        delete data[key];
      }
    });

    return data;
  }, [searchParams, defaultParams]);

  return params;
}

export const formatBussinessNumber = (str: string) => {
  str = str.replace(/[^0-9]/g, "");

  let tmp = "";

  if (str.length < 6) {
    tmp += str.substring(0, 3);
    tmp += "-";
    tmp += str.substring(3);
    return tmp;
  } else if (str.length < 11) {
    tmp += str.substring(0, 3);
    tmp += "-";
    tmp += str.substring(3, 2);
    tmp += "-";
    tmp += str.substring(5);
    return tmp;
  } else {
    return str;
  }
};

export const formatPhoneNumber = (value: string) => {
  if (!value) {
    return "";
  }

  value = value.replace(/[^0-9]/g, "");

  let result: string[] = [];
  let restNumber = "";

  // 지역번호와 나머지 번호로 나누기
  if (value.startsWith("02")) {
    // 서울 02 지역번호
    result.push(value.substring(0, 2));
    restNumber = value.substring(2);
  } else if (value.startsWith("1")) {
    // 지역 번호가 없는 경우
    // 1xxx-yyyy
    restNumber = value;
  } else {
    // 나머지 3자리 지역번호
    // 0xx-yyyy-zzzz
    result.push(value.substring(0, 3));
    restNumber = value.substring(3);
  }

  if (restNumber.length === 7) {
    // 7자리만 남았을 때는 xxx-yyyy
    result.push(restNumber.substring(0, 3));
    result.push(restNumber.substring(3));
  } else {
    result.push(restNumber.substring(0, 4));
    result.push(restNumber.substring(4));
  }

  return result.filter((val) => val).join("-");
};

export const openTimeToString = (
  type: OpenTimeType,
  data: OpenTimeObject[]
) => {
  return (
    type +
    "\n" +
    data
      .map(
        (x) =>
          `${x.start},${x.end},${x.break ? "1" : "0"},${x.breakStart},${
            x.breakEnd
          }`
      )
      .join("\n")
  );
};

export const openTimeToObject = (
  str: string
): [OpenTimeType, OpenTimeObject[]] => {
  const splited = str.split("\n");
  const type = splited.shift() as OpenTimeType;

  return [
    type,
    splited.map((x) => {
      const [start, end, breaks, breakStart, breakEnd] = x.split(",");
      return { start, end, breakStart, breakEnd, break: breaks === "1" };
    }),
  ];
};

export const getOpenTimeLabel = (
  type: OpenTimeType,
  obj: OpenTimeObject,
  index: number
) => {
  if (type === OpenTimeType.EVERYDAY) {
    return "매일";
  } else if (type === OpenTimeType.WEEK) {
    if (index === 0) return "주중";
    if (index === 1) return "주말";
  } else {
    if (index === 0) return "월";
    if (index === 1) return "화";
    if (index === 2) return "수";
    if (index === 3) return "목";
    if (index === 4) return "금";
    if (index === 5) return "토";
    if (index === 6) return "일";
  }
};
