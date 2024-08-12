"use client";

import { getOpenTimeLabel, openTimeToObject } from "@/utils";
import { Fragment, useMemo } from "react";

export const OpenTimes = ({ value }: { value: string }) => {
  const [type, objects] = useMemo(() => {
    return openTimeToObject(value);
  }, [value]);

  if (!value) return <></>;

  return (
    <div>
      {objects
        .filter((x) => x)
        .map((x, i) => {
          return (
            <Fragment key={i}>
              {i !== 0 && <br />}
              <span>
                <span className="mr-2">{getOpenTimeLabel(type, x, i)}</span>
                {x.start} ~ {x.end}
                {x.break && (
                  <span className="ml-2 text-[16px]">
                    (브레이크 타임 {x.breakStart} ~ {x.breakEnd})
                  </span>
                )}
              </span>
            </Fragment>
          );
        })}
    </div>
  );
};
