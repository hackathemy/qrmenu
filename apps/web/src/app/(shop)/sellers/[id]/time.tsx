import { getOpenTimeLabel, openTimeToObject } from "@/utils";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Image from "next/image";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { OpenTimeType } from "@hackathon/type";
import { Popover } from "react-tiny-popover";

dayjs.extend(customParseFormat);
dayjs.extend(duration);

export const Time = ({ timeString }: { timeString: string }) => {
  const [type, list] = openTimeToObject(timeString);
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const [width, setWidth] = useState(0);

  return (
    <Popover
      isOpen={open}
      positions={["top", "bottom", "left", "right"]}
      content={
        <div
          className="bg-white rounded-[8px] border-[1px] border-[#cccccc] p-2"
          style={{ width }}
        >
          {list.map((x, i) => {
            return (
              <div
                key={i}
                className={`text-[14px] text-[#101010] mb-2 last-of-type:mb-0 before:content-['•'] before:absolute relative before:-left-4 ml-6 ${
                  (type === OpenTimeType.EVERYDAY ||
                    (type === OpenTimeType.WEEK
                      ? i === 0
                        ? [1, 2, 3, 4, 5].includes(dayjs().get("day"))
                        : [0, 6].includes(dayjs().get("day"))
                      : dayjs().get("day") === (i === 6 ? 0 : i + 1))) &&
                  "font-bold"
                }`}
              >
                {t(getOpenTimeLabel(type, x, i) || "")}{" "}
                {dayjs(x.start, "HH:mm").format("A hh:00")}
                {" ~ "}
                {dayjs(x.end, "HH:mm").format("A hh:00")}
                {x.break && (
                  <>
                    <br />
                    <span className="text-[14px] text-[#999] font-light">
                      ({t("breaktime")}{" "}
                      {dayjs(x.breakStart, "HH:mm").format("A hh:00")}
                      {" ~ "}
                      {dayjs(x.breakEnd, "HH:mm").format("A hh:00")})
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>
      }
    >
      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="w-full h-8 mt-3.5 border-[1px] rounded-lg flex items-center"
          ref={(ref) => {
            if (ref?.offsetWidth) {
              setWidth(ref.clientWidth);
            }
          }}
        >
          <Image
            src="/clock.png"
            width={16}
            height={16}
            alt="Clock"
            className="mx-2.5"
          />

          {timeString && (
            <span className="font-medium">
              {t(getOpenTimeLabel(type, list[0], 0) || "")}{" "}
              {dayjs(list[0].start, "HH:mm").format("A hh:00")}
              {" ~ "}
              {dayjs(list[0].end, "HH:mm").format("A hh:00")}
            </span>
          )}
          {
            //     Weekday AM 11:00 ~ PM 21:00
          }
          <Image
            src={open ? "/chervon-up-grey.png" : "/chervon-down-grey.png"}
            className="ml-auto mr-3.5"
            width={10}
            height={6}
            alt="Chervon Down"
          />
        </button>
      </div>
    </Popover>
  );
};
