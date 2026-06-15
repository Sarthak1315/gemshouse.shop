import { NextResponse } from "next/server";

export function jsonResponse<T>(data: T, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}

export function parsePagination(urlStr: string) {
  const url = new URL(urlStr);
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "10", 10);
  const skip = (page - 1) * limit;

  return {
    page: Math.max(1, page),
    limit: Math.max(1, Math.min(100, limit)),
    skip: Math.max(0, skip),
  };
}

export function parseSearchParams(urlStr: string, allowedKeys: string[]) {
  const url = new URL(urlStr);
  const params: Record<string, string> = {};

  for (const key of allowedKeys) {
    const val = url.searchParams.get(key);
    if (val !== null) {
      params[key] = val;
    }
  }

  return params;
}
