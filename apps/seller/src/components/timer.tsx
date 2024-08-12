import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import { useEffect, useState } from "react";

export const Timer = ({ onTimeout }: { onTimeout: () => void }) => {
  const [remain, setReamin] = useState(60 * 3);

  useEffect(() => {
    if (remain === 0) return onTimeout();

    let tm = setTimeout(() => {
      setReamin((p) => p - 1);
    }, 1000);
    return () => {
      clearTimeout(tm);
    };
  }, [remain]);

  return (
    <span className="text-[14px] text-[#ff0000]">
      {dayjs().minute(0).second(remain).format("mm:ss")}
    </span>
  );
};
