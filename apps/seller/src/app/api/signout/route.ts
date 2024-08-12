import { NextRequest, NextResponse } from "next/server";

const signOutHandler = async (req: NextRequest) => {
  const response =
    req.method === "POST"
      ? new NextResponse(null, { status: 200 })
      : NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_BASE_URL));

  response.cookies.set({
    httpOnly: true,
    domain: process.env.NEXT_PUBLIC_HOSTNAME,
    value: "",
    name: "accessToken",
  });

  response.cookies.set({
    httpOnly: true,
    domain: process.env.NEXT_PUBLIC_HOSTNAME,
    value: "",
    name: "refreshToken",
  });

  return response;
};

export { signOutHandler as GET, signOutHandler as POST };
