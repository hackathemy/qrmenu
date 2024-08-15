import { BadgeAllegry } from "@/components/badge";
import { Menu } from "@hackathemy-qrmenu/type";
import { useTranslation } from "react-i18next";

export const Ingredient = ({ menu }: { menu: Menu }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h3 className="font-bold text-[20px]/[28px] m-4">{t("ingredient")}</h3>
      <div className="flex flex-col px-4 pb-4">
        {menu.translate.ingredients.map((x, i) => (
          <span key={i}>
            {i + 1}. {x}
          </span>
        ))}

        {menu.allergies.length >= 1 && (
          <>
            <h4 className="mt-5 font-bold">{t("allegry")}</h4>
            <div className="flex flex-wrap mt-3 mb-1">
              {menu.allergies.map((x, i) => (
                <BadgeAllegry key={i}>{t(x)}</BadgeAllegry>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
