import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

// Initialize Redis
const redis = Redis.fromEnv();

export async function GET() {
  const mode = await redis.get("mode");
  const acin = await redis.get("acin");
  const acout = await redis.get("acout");
  const steps = await redis.get("steps");
  const load = await redis.get("load");
  const protection = await redis.get("protection");

  return NextResponse.json({ mode, acin, acout, steps, load, protection });
}
