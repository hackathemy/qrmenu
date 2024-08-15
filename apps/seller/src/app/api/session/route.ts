import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import { apiClient, setBaseUrl } from "@hackathemy-qrmenu/api-client";
import { Role, Token, TokenPayload } from "@hackathemy-qrmenu/type";

setBaseUrl(process.env.NEXT_PUBLIC_API_URL as string);

const sessionHandler = async (request: NextRequest) => {
  const accessToken = request.cookies.get("accessToken");
  const refreshToken = request.cookies.get("refreshToken");
  const reset = request.nextUrl.searchParams.get("reset") === "1";

  if (!accessToken?.value) {
    return new Response(null, { status: 401 });
  }

  const payload = jwt.decode(accessToken.value) as any as TokenPayload & {
    exp: number;
  };

  const exp = dayjs(payload.exp * 1000);
  const now = dayjs();

  if (now.isAfter(exp) || reset) {
    try {
      if (!refreshToken?.value)
        return new Response(null, {
          status: 401,
          statusText: "Empty refresh token.",
        });

      const res = await apiClient.post("/accounts:refreshToken", {
        token: refreshToken.value,
      });

      const token = res.data.token as Token;

      const payload = jwt.decode(token.accessToken) as any;
      const refreshTokenPayload = jwt.decode(token.refreshToken) as any;

      const response = NextResponse.json({
        ...payload,
        accessToken: token.accessToken,
      });

      response.cookies.set({
        httpOnly: true,
        domain: process.env.NEXT_PUBLIC_HOSTNAME,
        value: token.accessToken,
        name: "accessToken",
        expires: payload.exp * 1000,
      });

      response.cookies.set({
        httpOnly: true,
        domain: process.env.NEXT_PUBLIC_HOSTNAME,
        value: token.refreshToken,
        name: "refreshToken",
        expires: refreshTokenPayload.exp * 1000,
      });

      return response;
    } catch (error) {
      console.error("session handle: ", error, payload);
      // delete tokens
      const response = NextResponse.json(payload, { status: 401 });
      response.cookies.set({
        httpOnly: true,
        value: "",
        domain: process.env.NEXT_PUBLIC_HOSTNAME,
        name: "accessToken",
      });

      response.cookies.set({
        httpOnly: true,
        value: "",
        domain: process.env.NEXT_PUBLIC_HOSTNAME,
        name: "refreshToken",
      });
      return response;
    }
  } else {
    return NextResponse.json({
      ...payload,
      accessToken: accessToken.value,
    });
  }
};

export { sessionHandler as GET };
