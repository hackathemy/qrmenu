import Image from "next/image";
import { useTranslation } from "react-i18next";
export const Pay = ({ prepayment }: { prepayment?: boolean }) => {
  const { t } = useTranslation();
  return (
    <div className="mt-2 flex items-center rounded-lg bg-[#f1f1f1] px-2.5 h-9">
      <Image src="/card.png" width={16} height={15} alt="Card" />
      <span className="font-bold ml-2.5">
        {prepayment ? t("prepayment") : t("postpayment")}
      </span>
    </div>
  );
};
