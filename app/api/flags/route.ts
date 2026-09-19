import { NextResponse } from "next/server";
import { giftingPromoFlag } from "@/flags";

/** Resolved flag values for client components. Not cached, so a dashboard
    toggle takes effect on the next page load. */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    { giftingPromo: await giftingPromoFlag() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
