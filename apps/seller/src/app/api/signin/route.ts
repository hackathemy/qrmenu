import { ApiError, apiClient, setBaseUrl } from "@hackathon-qrmenu/api-client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { Role } from "@hackathon-qrmenu/type";

setBaseUrl(process.env.NEXT_PUBLIC_API_URL as string);

const signInHandler = async (req: NextRequest) => {
  const { email, password, autoLogin } = await req.json();

  try {
    const { data } = await apiClient.post("/accounts:signInWithEmail", {
      email,
      password,
    });

    const payload = jwt.decode(data.token.accessToken) as any;
    const refreshTokenPayload = jwt.decode(data.token.refreshToken) as any;

    const response = new NextResponse(null, { status: 200 });

    response.cookies.set({
      httpOnly: true,
      domain: process.env.NEXT_PUBLIC_HOSTNAME,
      value: data.token.accessToken,
      name: "accessToken",
      expires: payload.exp * 1000,
    });

    if (autoLogin) {
      response.cookies.set({
        httpOnly: true,
        domain: process.env.NEXT_PUBLIC_HOSTNAME,
        value: data.token.refreshToken,
        name: "refreshToken",
        expires: refreshTokenPayload.exp * 1000,
      });
    }

    return response;
  } catch (error: unknown) {
    const apiError = error as ApiError;
    return NextResponse.json(apiError.data, {
      status: apiError.status,
      statusText: apiError.statusText,
    });
  }
};

export { signInHandler as POST };
