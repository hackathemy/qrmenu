import { NextRequest, NextResponse } from "next/server";

const pingHandler = async (request: NextRequest) => {
  return new NextResponse("pong", { status: 200 });
};

export { pingHandler as GET };
