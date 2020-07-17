if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(async (position) => {
    let lat, lon, weather, air;
    try {
      lat = position.coords.latitude;
      lon = position.coords.longitude;
      document.getElementById("latitude").textContent = lat.toFixed(2);
      document.getElementById("longitude").textContent = lon.toFixed(2);

      const response = await fetch(`/weather/${lat},${lon}`);
      const json = await response.json();
      weather = json.weather_data;
      const summary = weather.weather_code.value.split("_").join(" ");
      document.getElementById("summary").textContent = summary;
      document.getElementById("temperature").textContent = weather.temp.value;

      air = json.aq_data.results[0].measurements[0];
      document.getElementById("aq_parameter").textContent = air.parameter;
      document.getElementById("aq_value").textContent = air.value;
      document.getElementById("aq_units").textContent = air.unit;
      document.getElementById("aq_date").textContent = air.lastUpdated;
    } catch (error) {
      air = { value: -1 };
      document.getElementById("aq-sentence").remove();
    }

    // post data to database
    data = { lat, lon, weather, air };
    options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const db_response = await fetch("/api", options);
  });
} else {
  console.log("geolocation IS NOT available");
}
