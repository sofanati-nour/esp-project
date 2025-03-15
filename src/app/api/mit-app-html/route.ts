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
// server.send(200, "text/html", page);export default function GET(req: Request) {
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
  const ssid = await redis.get("ssid");
  const pass = await redis.get("pass");
  const value = await redis.get("value");
  let page =`<html><body>`
  page += `,${mode},${acin},${acout},${steps},${load},${protection},0,`
  page += `SSID: ${ssid}<br>`
  page += `Password: ${pass}<br>`
  page += `Stored Value: ${value}<br>`
  page += `<form action='/get' method='GET'>`
  page += `SSID: <input type='text' name='ssid' value='${ssid}'><br>`
  page += `Password: <input type='text' name='pass' value='${pass}'><br>`
  page += `Value: <input type='text' name='value' value='${value}'><br>`
  page += `<input type='submit' value='Save'></form></body></html>`
  return new Response(page, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
