// app/api/ai/trending/route.ts
// API route for trending bounty categories

import { NextResponse } from "next/server";
import { getTrendingBountyCategories } from "@/lib/actions/ai";

export async function GET() {
  try {
    const result = await getTrendingBountyCategories();

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error: any) {
    console.error("AI trending API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
