import {
  PaymentCardType,
  PaymentCashType,
  PaymentSmartPayType,
} from "@hackathon/type";
import Image from "next/image";

export const PayItem = ({
  type,
}: {
  type: PaymentCardType | PaymentCashType | PaymentSmartPayType;
}) => {
  return (
    <div className="flex items-center">
      {type === "cash" ? (
        <Image src={"/cash.png"} alt={"Cash"} width={17} height={15} />
      ) : null}
      {type === "local" ? (
        <Image
          src={"/local-currency.png"}
          alt={"Cash"}
          width={18}
          height={14}
        />
      ) : null}
      {type === "dome" ? (
        <Image src={"/domestic-card.png"} alt={"Cash"} width={16} height={15} />
      ) : null}
      {type === "visa" ? (
        <Image src={"/visa.png"} alt={"Cash"} width={24} height={8} />
      ) : null}
      {type === "dinners" ? (
        <Image src={"/dinnersclub.png"} alt={"Cash"} width={24} height={20} />
      ) : null}
      {type === "master" ? (
        <Image src={"/mastercard.png"} alt={"Cash"} width={24} height={19} />
      ) : null}
      {type === PaymentCardType.American ? (
        <Image
          src={"/americanexpress.png"}
          alt={"Cash"}
          width={24}
          height={9}
        />
      ) : null}
      {type === PaymentCardType.Maestro ? (
        <Image src={"/maestro.png"} alt={"Cash"} width={24} height={18} />
      ) : null}
      {type === "jcb" ? (
        <Image src={"/jcb.png"} alt={"Cash"} width={24} height={24} />
      ) : null}
      {type === PaymentCardType.Union ? (
        <Image src={"/unionpay.png"} alt={"Cash"} width={24} height={16} />
      ) : null}
      {type === "ap" ? (
        <Image src={"/applepay.png"} alt={"Cash"} width={24} height={10} />
      ) : null}
      {type === "tos" ? (
        <Image src={"/tosspay.png"} alt={"Cash"} width={40} height={12} />
      ) : null}
      {type === "ka" ? (
        <Image src={"/kakaopay.png"} alt={"Cash"} width={39} height={16} />
      ) : null}
      {type === "na" ? (
        <Image src={"/naverpay.png"} alt={"Cash"} width={41} height={16} />
      ) : null}
      {type === "sam" ? (
        <Image src={"/samsungpay.png"} alt={"Cash"} width={20} height={20} />
      ) : null}
      {type === "all" ? (
        <Image src={"/allpay.png"} alt={"Cash"} width={20} height={20} />
      ) : null}
      {type === "wechat" ? (
        <Image src={"/wechatpay.png"} alt={"Cash"} width={16} height={15} />
      ) : null}
      {type === "pay" ? (
        <Image src={"/paypal.png"} alt={"Cash"} width={17} height={20} />
      ) : null}
      <span className="text-[12px] ml-2">
        {type === "cash" ? "Cash" : ""}
        {type === "local" ? "Local Currency" : ""}
        {type === "dome" ? "Domestic Card" : ""}
        {type === "visa" ? "VISA" : ""}
        {type === "dinners" ? "Dinners Club" : ""}
        {type === "master" ? "Mastercard" : ""}
        {type === PaymentCardType.American ? "American Express" : ""}
        {type === PaymentCardType.Maestro ? "Maestro" : ""}
        {type === "jcb" ? "JCB" : ""}
        {type === PaymentCardType.Union ? "UnionPay" : ""}
        {type === "ap" ? "Apple Pay" : ""}
        {type === "tos" ? "Toss Pay" : ""}
        {type === "ka" ? "Kakao Pay" : ""}
        {type === "na" ? "Naver Pay" : ""}
        {type === "sam" ? "Samsung Pay" : ""}
        {type === "all" ? "All Pay" : ""}
        {type === "wechat" ? "Wechat Pay" : ""}
        {type === "pay" ? "Paypal" : ""}
      </span>
    </div>
  );
};
