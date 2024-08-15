export enum UsageGuide {
  WiFi = "wifi",
  Toilet = "toilet",
  BabyKids = "kids",
  Payments = "payments",
  Accessibilitys = "accessibilitys",
  Parking = "parking",
}

export enum LangCode {
  KO = "ko",
  EN = "en",
  JA = "ja",
  ZH_CN = "zh_CN",
  ZH_TW = "zh_TW",
  TH = "th",
  ES_ES = "es_ES",
  MS = "ms",
  VI = "vi",
  /** not support yet */
  AR = "ar",
}

export enum Currency {
  KRW = "KRW",
  USD = "USD",
  JPY = "JPY",
  CNY = "CNY",
  HKD = "HKD",
  AED = "AED",
  NTD = "NTD",
  SGD = "SGD",
  VND = "VND",
  MYR = "MYR",
  PHP = "PHP",
  EUR = "EUR",
  THB = "THB",
}

export enum Unit {
  Metric = "metric",
  Imperial = "imperial",
}

export interface TokenPayload {
  sub: number;
  accountId: number;

  roles: Role[];
}

export enum Role {
  ADMIN = "A",
  SELLER = "S",
}

export type RequestUser = TokenPayload;

export enum SettingMessageType {
  OPTIONS = "o",
  CART = "c",
  GO_TO_CART = "g_c",
  DELETED = "d",
  SAVE = "s",
  PAYMENT_F = "p_f",
  PAYMENT_L = "p_l",
}

export interface Token {
  accessToken: string;
  refreshToken: string;
}

export enum SellerType {
  KOREAN = "k",
  ASIAN = "a",
  AMERICAN = "en",
  CHINESE = "ch",
  JAPANENESE = "ja",
  JOINFOOD = "j",
  ETC = "e",
}

export enum AccountStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  REJECTED = "REJECTED",
  HOLD = "HOLD",
}

export interface Seller {
  guideOrders: UsageGuide[];
  id: number;

  visible: boolean;

  name: string;

  contact: string;

  type: SellerType;

  managerPhoneNumber: string;

  companyName: string;

  companyNumber: string;

  companyNumberImage: JoinFile;

  ceoName: string;

  ceoPhoneNumber: string;

  address: string;
  prepayment: boolean | null;
  openTime: string | null;

  addressDetail: string;

  createdAt: Date;
  account: JoinAccount;

  wifiSSID: string | null;
  wifiKey: string | null;

  enabledPayment: boolean | null;

  enabledWifi: boolean | null;

  enabledToilet: boolean | null;

  enabledKids: boolean | null;

  enabledAccessibility: boolean | null;

  enabledParking: boolean | null;

  paymentCashTypes: PaymentCashType[];
  paymentCardTypes: PaymentCardType[];
  paymentSmartPayTypes: PaymentSmartPayType[];
}

export interface JoinAccount {
  email: string;
  id: number;
  phoneNumber: string;
  createdAt: Date;
}

export interface JoinFile {
  id: number;

  size: number;

  fileName: string;

  contentType: string;

  key: string;
}

export interface Account {
  id: number;
  email: string;
  createdAt: string;
  phoneNumber: string;
  status: AccountStatus;
}

export interface SellerTranslateDto {
  id: number;
  name: string;
  introductionHtml: string;
  address: string;
  addressDetail: string;
  openTimeHtml: string;
  langCode: LangCode;
  introductionHtmlTranslatedAt: Date | null;

  introductionHtmlUpdatedAt: Date | null;

  openTimeHtmlTranslatedAt: Date | null;

  openTimeHtmlUpdatedAt: Date | null;

  nameTranslatedAt: Date | null;

  nameUpdatedAt: Date | null;

  kidsHtml: string;
  kidsHtmlTranslatedAt: Date | null;
  kidsHtmlUpdatedAt: Date | null;

  accessibilityHtml: string;
  accessibilityHtmlTranslatedAt: Date | null;
  accessibilityHtmlUpdatedAt: Date | null;

  parkingHtml: string;
  parkingHtmlTranslatedAt: Date | null;
  parkingHtmlUpdatedAt: Date | null;

  toiletHtml: string;
  toiletHtmlTranslatedAt: Date | null;
  toiletHtmlUpdatedAt: Date | null;
}

export enum OpenTimeType {
  EVERYDAY = "E",
  WEEK = "W",
  DAY = "D",
}

export enum OpenTime {
  T1 = "00:00",
  T2 = "01:00",
  T3 = "02:00",
  T4 = "03:00",
  T5 = "04:00",
  T6 = "05:00",
  T7 = "06:00",
  T8 = "07:00",
  T9 = "08:00",
  T10 = "09:00",
  T11 = "10:00",
  T12 = "11:00",
  T13 = "12:00",
  T14 = "13:00",
  T15 = "14:00",
  T16 = "15:00",
  T17 = "16:00",
  T18 = "17:00",
  T19 = "18:00",
  T20 = "19:00",
  T21 = "20:00",
  T22 = "21:00",
  T23 = "22:00",
  T24 = "23:00",
}

export interface OpenTimeObject {
  start: string;
  end: string;
  break: boolean;
  breakStart: string;
  breakEnd: string;
}

export enum PaymentCardType {
  Dome = "dome",
  Visa = "visa",
  Dinners = "dinners",
  Master = "master",
  American = "american",
  Maestro = "maestro",
  Jcb = "jcb",
  Union = "union",
}

export enum PaymentCashType {
  Cash = "cash",
  Local = "local",
}

export enum PaymentSmartPayType {
  Apple = "ap",
  Toss = "tos",
  Kakao = "ka",
  Naver = "na",
  Samsung = "sam",
  All = "all",
  Wechat = "wechat",
  Paypal = "pay",
}

export enum MenuBadge {
  Influencer = "influencer",
  New = "new",
  Rec = "rec",
}

export enum MenuFoodStyle {
  Halal = "Halal",
  Vege = "Vege",
  Began = "Began",
  Lacto = "Lacto",
  Ovo = "Ovo",
  LactoOvo = "LactoOvo",
  Pesco = "pesco",
  Pollo = "pollo",
}

export enum MenuAllergy {
  Milk = "Milk", //우유
  Buckwheat = "Buckwheat", //메밀
  Wheat = "Wheat", //밀가루
  Soybean = "Soybean", //대두
  Peanut = "Peanut", //땅콩
  Pine = "PineNut", //잣
  Walnut = "Walnut", //호두
  Peach = "Peach", //복숭아
  Tomato = "Tomato", //토마토
  Pork = "Pork", //돼지고기
  Chicken = "Chicken", //닭고기
  Beef = "Beef", //소고기
  Eggs = "Eggs", //난류(달걀, 메추리 등)
  Squid = "Squid", //오징어
  Mackerel = "Mackerel", //고등어
  Crab = "Crab", //게
  Shrimp = "Shrimp", //새우
  Shellfish = "Shellfish", //굴, 홍합, 전복
  Sulfites = "Sulfites", //아황산류
}

export enum MenuUnit {
  KG = "kg",
  G = "g",
  L = "l",
  ML = "ml",
}

export interface Category {
  id: number;
  isPrivate: boolean;
  menuTotalSize: number;
  translate: {
    id: number;
    langCode: LangCode;
    name: string;
  };
}

export interface OptionTranslate {
  id: number;
  langCode: string;
  name: string;
}

export interface OptionItem {
  name: string;
  price: number;
  weight: number;
  id: number;
  unit: MenuUnit;
  quantityMultiple: boolean;
  quantityMax: number;
  translate: OptionTranslate;
  translateKR?: OptionTranslate;

  quantity?: number;
  selected?: boolean;
}

export interface OptionGroup {
  id: number;

  isRequired: boolean;
  isDefault: boolean;
  isFree: boolean;
  translate: OptionTranslate;
  translateKR?: OptionTranslate;
  items: OptionItem[];
}

export interface MenuImage {
  image: {
    id: number;
    size: number;
    key: string;
    fileName: string;
    contentType: string;
  };
}
export interface MenuTranslate {
  updatedAt: string | null;
  translatedAt: string | null;

  id: number;
  langCode: string;
  name: string;
  description: string;
  guide: string;
  ingredients: string[];
}
export interface Menu {
  images: MenuImage[];
  categories: {
    id: number;
    category: Category;
  }[];
  cat?: { index: number; id: number };
  optionGroups: OptionGroup[];
  translate: MenuTranslate;
  translateKR: MenuTranslate;
  id: number;
  isPrivate: boolean;
  isSoldOut: boolean;
  badges: MenuBadge[];
  foodStyles: MenuFoodStyle[];
  allergies: MenuAllergy[];
}

export interface Content {
  id: number;
  createdAt: Date;
  views: number;
  translate: {
    id: number;
    title: string;
    descriptionHtml: string;
    updatedAt: Date | null;
    translatedAt: Date | null;
    langCode: LangCode;
  };
  thumbnail: {
    id: number;
    size: number;
    key: string;
    fileName: string;
    contentType: string;
  };
  isPrivate: boolean;
  isPin: boolean;
}
