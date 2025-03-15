import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Redis } from "@upstash/redis";

// Initialize Redis
const redis = Redis.fromEnv();


const dataSchema = z.object({
  mode: z.number().min(1).max(5),
  acin: z.number().min(0).max(220),
  acout: z.number().min(0).max(220),
  steps: z.number().min(1).max(16),
  load: z.number().min(0).max(100),
  protection: z.number().min(0).max(2),
});

export async function POST(request: NextRequest) {
  const data = await request.json();
  const validatedData = dataSchema.parse(data);

  const { mode, acin, acout, steps, load, protection } = validatedData;

  redis.set("mode", mode);
  redis.set("acin", acin);
  redis.set("acout", acout);
  redis.set("steps", steps);
  redis.set("load", load);
  redis.set("protection", protection);

  return NextResponse.json({ message: "Data stored successfully" });
}
