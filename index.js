const express = require("express");
const Nedb = require("nedb");
const fetch = require("node-fetch");
require("dotenv").config();
const app = express();

app.listen(3000, () => {
  console.log("Server start listening");
});

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

const db = new Nedb("database.db");
db.loadDatabase();

app.post("/api", (req, res) => {
  console.log("i got a request");
  const data = req.body;
  const timestamp = Date.now();
  data.timestamp = timestamp;
  db.insert(data);
  res.json({ status: "success", ...data });
});

app.get("/api", (req, res) => {
  db.find({}, (err, data) => {
    if (err) {
      res.end();
      return;
    }
    res.json(data);
  });
});

app.get("/weather/:latlon", async (req, res) => {
  const latlon = req.params.latlon.split(",");
  const lat = latlon[0];
  const lon = latlon[1];
  const weather_api_key = process.env.API_KEY;
  const weather_api = `https://api.climacell.co/v3/weather/realtime?lat=${lat}&lon=${lon}&unit_system=si&fields=feels_like%2Ctemp%2Cweather_code&apikey=${weather_api_key}`;
  const weather_response = await fetch(weather_api);
  const weather_data = await weather_response.json();

  const aq_api = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}`;
  const aq_response = await fetch(aq_api);
  const aq_data = await aq_response.json();

  const data = {
    weather_data,
    aq_data,
  };

  res.json(data);
});
