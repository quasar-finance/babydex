import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ referralCode: string }> },
) {
  const { referralCode } = await params;

  const redirectUrl = new URL("/points", request.url);
  redirectUrl.searchParams.set("referralCode", referralCode);

  return NextResponse.redirect(redirectUrl);
}
