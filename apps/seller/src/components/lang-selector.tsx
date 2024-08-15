import { LangCode } from "@hackathemy-qrmenu/type";
import { Select } from "./select";
import { getLangCodeLabel } from "@/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { stringify } from "querystring";
import { useLang } from "@/hooks/use-lang";

export const LangSelector = ({}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const langCode = useLang();

  const supportLangs = Object.values(LangCode);

  return (
    <div className="flex items-center">
      언어별 메뉴
      <Select
        className="ml-3 w-[300px]"
        options={Object.values(LangCode).map((x) => ({
          label: getLangCodeLabel(x),
          value: x,
          disabled:
            supportLangs.findIndex(
              (z: any) => z.langCode === x && z.disabled
            ) >= 0,
        }))}
        selectProps={{
          placeholder: "언어 선택",
          value: langCode,
          onChange: (e) => {
            router.push(
              `${pathname}?${stringify({
                ...Object.fromEntries(searchParams),
                langCode: e.target.value,
              })}`
            );
          },
        }}
      />
    </div>
  );
};
