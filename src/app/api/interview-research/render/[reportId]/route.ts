import { NextResponse } from "next/server";

export async function GET(_: Request, ctx: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await ctx.params;
  // TODO: return rendered HTML/PDF for report
  return NextResponse.json({ reportId, html: "<p>Report preview will render here.</p>" });
}
