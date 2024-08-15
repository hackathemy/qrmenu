import { ApiError, apiClient, setBaseUrl } from "@hackathemy-qrmenu/api-client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

setBaseUrl(process.env.NEXT_PUBLIC_API_URL as string);

const signUpHandler = async (req: NextRequest) => {
  const { email, password, authId } = await req.json();

  try {
    const { data } = await apiClient.post("/accounts:signUpWithEmail", {
      email,
      password,
      authId,
    });

    const payload = jwt.decode(data.token.accessToken) as any;
    const refreshTokenPayload = jwt.decode(data.token.refreshToken) as any;

    const response = new NextResponse(null, { status: 200 });

    /*
    회원가입 후 로그인 유도함
    response.cookies.set({
      httpOnly: true,
      domain: process.env.NEXT_PUBLIC_HOSTNAME,
      value: data.token.accessToken,
      name: "accessToken",
      expires: payload.exp * 1000,
    });

    response.cookies.set({
      httpOnly: true,
      domain: process.env.NEXT_PUBLIC_HOSTNAME,
      value: data.token.refreshToken,
      name: "refreshToken",
      expires: refreshTokenPayload.exp * 1000,
    });*/

    return response;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    return NextResponse.json(apiError.data, {
      status: apiError.status,
      statusText: apiError.statusText,
    });
  }
};

export { signUpHandler as POST };
