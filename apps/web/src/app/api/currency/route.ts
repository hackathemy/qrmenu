import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const res = await fetch(
    `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${
      process.env.KOREA_EXIM_AUTH_KEY
    }&searchdate=${dayjs().subtract(1, "days").format("YYYYMMDD")}&data=AP01`
  );

  if (res.status === 200) {
    const data = await res.json();
    return NextResponse.json(data, res);
  }

  return new NextResponse(null, res);
};
