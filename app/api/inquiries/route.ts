import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { createInquiry } from "@/lib/mutations";

export async function POST(request: Request) {
  try {
    const result = await createInquiry(await request.json());
    return NextResponse.json({ ok: true, ...result }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { ok: false, errors: error.flatten().fieldErrors },
        { status: 422 },
      );
    }

    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
