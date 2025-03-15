#include <ESP8266WiFi.h>
#include <EEPROM.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>

#define EEPROM_SIZE 96
#define SSID_ADDR 0
#define PASS_ADDR 32
#define DATA_ADDR 64
#define AP_SSID "SOFTRONICS_HOTSPOT"
#define AP_PASS "12345678"

IPAddress local_IP(192, 168, 1, 199);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

ESP8266WebServer server(80);
bool isAPMode = false;

int data=0;
int data1=255;  //  MODE
int data2=250;  //  ACIN
int data3=240;  //  ACIN
int data4=230;  //  ACout

int data5=220;  //  STEPS
int data6=200;  //  LOAD
int data7=115;  //  PROTECTION

int acin=0;

void sendJsonDataToAPI() {
    // Check if WiFi is connected
    if (WiFi.status() != WL_CONNECTED) {
        Serial.println("Error: WiFi not connected");
        return;
    }

    String url = "https://esp-project-xi.vercel.app/api/set";
    String jsonData = "{\"mode\":" + String(data1) + ",\"acin\":" + String(data2) + ",\"acout\":" + String(data3) + ",\"steps\":" + String(data5) + ",\"load\":" + String(data6) + ",\"protection\":" + String(data7) + "}";
    
    WiFiClient client;
    HTTPClient http;
    
    http.begin(client, url);
    http.addHeader("Content-Type", "application/json");
    http.setTimeout(10000);  // 10 second timeout
    
    int httpCode = http.POST(jsonData);
    
    if (httpCode > 0) {
        // HTTP header has been sent and Server response header has been handled
        if (httpCode == HTTP_CODE_OK) {
            String payload = http.getString();
            Serial.println("API Response: " + payload);
        } else {
            Serial.printf("HTTP Error: %d\n", httpCode);
        }
    } else {
        Serial.printf("HTTP Request failed: %s\n", http.errorToString(httpCode).c_str());
    }
    
    http.end();
}

void saveToEEPROM(int addr, String data) {
    EEPROM.begin(EEPROM_SIZE);
    for (int i = 0; i < 32; i++) {
        EEPROM.write(addr + i, i < data.length() ? data[i] : 0);
    }
    EEPROM.commit();
}

String readFromEEPROM(int addr) {
    EEPROM.begin(EEPROM_SIZE);
    char data[32] = {0};
    for (int i = 0; i < 32; i++) {
        data[i] = EEPROM.read(addr + i);
    }
    return String(data);
}

void handleRoot() {
    String ssid = readFromEEPROM(SSID_ADDR);
    String pass = readFromEEPROM(PASS_ADDR);
    String storedData = readFromEEPROM(DATA_ADDR);
    String page = "<html><body>";
    page += ","+String(data)+","+String(acin)+","+String(data3)+","+String(data4)+","+String(data5)+","+String(data6)+","+String(data7)+",";
    page += "SSID: " + ssid + "<br>";
    page += "Password: " + pass + "<br>";   // www.sofanati.com/ahmad/"220,115,222,321,123,444,555,"
    page += "Stored Value: " + storedData + "<br><br>";
    page += "<form action='/set' method='GET'>";
    page += "SSID: <input type='text' name='ssid'><br>";
    page += "Password: <input type='text' name='pass'><br>";
    page += "Value: <input type='text' name='value'><br>";
    page += "<input type='submit' value='Save'></form></body></html>";
    server.send(200, "text/html", page);
}

void handleSet() {
    if (server.hasArg("ssid") && server.hasArg("pass") && server.hasArg("value")) {
        saveToEEPROM(SSID_ADDR, server.arg("ssid"));
        saveToEEPROM(PASS_ADDR, server.arg("pass"));
        saveToEEPROM(DATA_ADDR, server.arg("value"));
        server.send(200, "text/html", "<html><body><h2>Data Saved! Rebooting...</h2></body></html>");
        delay(2000);
        ESP.restart();
    } else {
        server.send(400, "text/html", "<html><body><h2>Invalid Request</h2></body></html>");
    }
}

void setup() {
    Serial.begin(9600);
    EEPROM.begin(EEPROM_SIZE);
    WiFi.mode(WIFI_AP_STA);
    
    String ssid = readFromEEPROM(SSID_ADDR);
    String pass = readFromEEPROM(PASS_ADDR);
    if (ssid.length() > 0) {
        WiFi.config(local_IP, gateway, subnet);
        WiFi.begin(ssid.c_str(), pass.c_str());
        //Serial.print("Connecting to WiFi");
        for (int i = 0; i < 10; i++) {
            if (WiFi.status() == WL_CONNECTED) {
                //Serial.println("\nConnected!");
                //Serial.println(WiFi.localIP());
                break;
            }
            delay(1000);
            //Serial.print(".");
        }
    }
    
    if (WiFi.status() != WL_CONNECTED) {
        //Serial.println("\nFailed to connect, switching to AP mode");
        WiFi.softAP(AP_SSID, AP_PASS);
        //Serial.print("AP IP: ");
        //Serial.println(WiFi.softAPIP());
        isAPMode = true;
    }
    
    server.on("/", handleRoot);
    server.on("/set", handleSet);
    server.begin();
}

void loop() {
    if (Serial.available())
  {
  data=Serial.read();delay(10);
  data1=Serial.read();delay(10);
  data2=Serial.read();delay(10);
  data3=Serial.read();delay(10);
  data4=Serial.read();delay(10);
  data5=Serial.read();delay(10);
  data6=Serial.read();delay(10);
  data7=Serial.read();delay(10);
  acin=(data1*255)+data2;
  }
    server.handleClient();
}