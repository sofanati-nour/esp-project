import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Redis } from "@upstash/redis";

// Initialize Redis
const redis = Redis.fromEnv();

// String page = "<html><body>";
// page += ","+String(data)+","+String(acin)+","+String(data3)+","+String(data4)+","+String(data5)+","+String(data6)+","+String(data7)+",";
// page += "SSID: " + ssid + "<br>";
// page += "Password: " + pass + "<br>";   // www.sofanati.com/ahmad/"220,115,222,321,123,444,555,"
// page += "Stored Value: " + storedData + "<br><br>";
// page += "<form action='/set' method='GET'>";
// page += "SSID: <input type='text' name='ssid'><br>";
// page += "Password: <input type='text' name='pass'><br>";
// page += "Value: <input type='text' name='value'><br>";
// page += "<input type='submit' value='Save'></form></body></html>";
// server.send(200, "text/html", page);

const dataSchema = z.object({
  mode: z.number().min(1).max(5),
  acin: z.number().min(0).max(220),
  acout: z.number().min(0).max(220),
  steps: z.number().min(1).max(16),
  load: z.number().min(0).max(100),
  protection: z.number().min(0).max(2),
  ssid: z.string().min(1),
  pass: z.string().min(1),
  value: z.string().min(1),
});

export async function POST(request: NextRequest) {
  const data = await request.json();
  const validatedData = dataSchema.parse(data);

  const { mode, acin, acout, steps, load, protection, ssid, pass, value } = validatedData;

  redis.set("mode", mode);
  redis.set("acin", acin);
  redis.set("acout", acout);
  redis.set("steps", steps);
  redis.set("load", load);
  redis.set("protection", protection);
  redis.set("ssid", ssid);
  redis.set("pass", pass);
  redis.set("value", value);

  return NextResponse.json({ message: "Data stored successfully" });
}
