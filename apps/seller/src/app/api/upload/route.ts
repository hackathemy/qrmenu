import { NextRequest, NextResponse } from "next/server";

const uploadHandler = async (req: NextRequest) => {
  const form = await req.formData();

  const file: File | null = form.get("file") as unknown as File;

  const url = req.headers.get("x-signed-url") as string;

  const res = await fetch(url, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type,
    },
  });

  return new NextResponse(res.body, res);
};

export { uploadHandler as POST };
