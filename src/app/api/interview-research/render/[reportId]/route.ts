import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { reportId: string } }) {
  // TODO: return rendered HTML/PDF for report
  return NextResponse.json({ reportId: params.reportId, html: "<p>Report preview will render here.</p>" });
}
