getData();
async function getData() {
  const response = await fetch("/api").then((res) => res.json());

  let mymap = L.map("mapid").setView([0, 0], 1);
  const attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
  const tileURL = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  L.tileLayer(tileURL, {
    attribution,
  }).addTo(mymap);

  for (const item of response) {
    const marker = L.marker([item.lat, item.lon]).addTo(mymap);
    let txt = `The weather here is ${item.lat}, ${item.lon} with a temperature of ${item.weather.temp.value}°C.`;
    if (item.air.value < 0) {
      txt += `No air quality data for this place`;
    } else {
      txt += `The concentration of particulate matter (${item.air.parameter}) is ${item.air.value} ${item.air.unit} last read on ${item.air.lastUpdated}`;
    }
    marker.bindPopup(txt);
  }
}
