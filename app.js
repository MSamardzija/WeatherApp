window.addEventListener("load", () => {
  let long;
  let lat;
  let temepratureDescription = document.querySelector(
    ".temperature-description"
  );
  let temperatureDegree = document.querySelector(".temperature-degree");
  let locationTimezone = document.querySelector(".location-timezone");
  let temperatureSection = document.querySelector(".temperature");
  let temeratureSpan = document.querySelector(".temperature span");

  //Checks if user location is allowed to access
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;

      const proxy = "https://cors-anywhere.herokuapp.com/";
      const api = `${proxy}https://api.darksky.net/forecast/fd9d9c6418c23d94745b836767721ad1/${lat},${long}`;

      fetch(api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          const { temperature, summary, icon } = data.currently;
          // Set elements
          temperatureDegree.textContent = temperature;
          temepratureDescription.textContent = summary;
          locationTimezone.textContent = data.timezone;
          let celsius = (temperature - 32) * (5 / 9);
          // Set icons
          setIcons(icon, document.querySelector(".icon"));

          // Change temeperature to Celsius
          temperatureSection.addEventListener("click", () => {
            if (temeratureSpan.textContent === "F") {
              temeratureSpan.textContent = "C";
              temperatureDegree.textContent = Math.floor(celsius);
            } else {
              temeratureSpan.textContent = "F";
              temperatureDegree.textContent = temperature;
            }
          });
        });
    });
  }

  function setIcons(icon, iconID) {
    const skycons = new Skycons({ color: "white" });

    // Looks for every - (line) and replaces it with _ because you are getting data in api with those lines -
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }
});
