import { Content } from "@/components/content";
import { useLang } from "@/hooks/use-lang";
import { apiClient } from "@hackathemy-qrmenu/api-client";
import { Content as ContentT } from "@hackathemy-qrmenu/type";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useTranslation } from "react-i18next";

export const Contents = ({}) => {
  const { id: sellerId } = useParams();

  const langCode = useLang();

  const listContents = useSWR(
    sellerId
      ? {
          url: `/contents`,
          params: {
            sellerId,
            pageOffset: 0,
            pageLimit: 100000,
            langCode,
            isPrivate: "0",
          },
        }
      : null,
    (arg) =>
      apiClient.get<{ contents: ContentT[]; totalSize: number }>(arg.url, {
        params: arg.params,
      })
  );

  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-[#f1f1f1]">
      <h3 className="font-extrabold text-[20px]/[28px] m-4">{t("contents")}</h3>
      {listContents.data?.data.contents.map((x, i) => {
        return <Content key={i} content={x} />;
      })}
    </div>
  );
};
