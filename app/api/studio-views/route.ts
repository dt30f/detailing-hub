import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { createStudioView } from "@/lib/mutations";

const transparentGif = Uint8Array.from([
  71, 73, 70, 56, 57, 97, 1, 0, 1, 0, 128, 0, 0, 0, 0, 0, 255, 255, 255, 33,
  249, 4, 1, 0, 0, 0, 0, 44, 0, 0, 0, 0, 1, 0, 1, 0, 0, 2, 2, 68, 1, 0, 59,
]);

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim();
  }

  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    undefined
  );
}

function getViewerHash(request: NextRequest) {
  const ip = getClientIp(request);

  if (!ip) {
    return undefined;
  }

  const salt =
    process.env.ANALYTICS_SALT ||
    process.env.ADMIN_PASSWORD ||
    "detailinghub-local-analytics";

  return createHash("sha256")
    .update(`${salt}:${ip}`)
    .digest("hex");
}

export async function GET(request: NextRequest) {
  const studioId = request.nextUrl.searchParams.get("studioId");
  const pathname = request.nextUrl.searchParams.get("pathname") || undefined;

  if (studioId) {
    try {
      await createStudioView(
        { studioId, pathname },
        {
          viewerHash: getViewerHash(request),
          referrer: request.headers.get("referer"),
          userAgent: request.headers.get("user-agent"),
        },
      );
    } catch {
      // Tracking pixels should never break profile page rendering.
    }
  }

  return new NextResponse(transparentGif, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const result = await createStudioView(await request.json(), {
      viewerHash: getViewerHash(request),
      referrer: request.headers.get("referer"),
      userAgent: request.headers.get("user-agent"),
    });

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
