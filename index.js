async function getDashboardData(query) {
  try {
    const [destinationResponse, weatherResponse, airportsResponse] =
      await Promise.all([
        fetch(`http://localhost:3333/destinations?search=${query}`),
        fetch(`http://localhost:3333/false_weathers?search=${query}`),
        fetch(`http://localhost:3333/airports?search=${query}`),
      ]);
    const [destinationJSONResult, weatherJSONResult, airportsJSONResult] =
      await Promise.allSettled([
        destinationResponse.json(),
        weatherResponse.json(),
        airportsResponse.json(),
      ]);

    // BONUS 2 SOLUTION

    let destinationJSON = [];
    let weatherJSON = [];
    let airportsJSON = [];

    if (destinationJSONResult.status === "rejected") {
      console.error("Problema in destination", destinationJSONResult.reason);
    } else {
      destinationJSON = destinationJSONResult.value;
    }
    if (weatherJSONResult.status === "rejected") {
      console.error("Problema in weathers", weatherJSONResult.reason);
    } else {
      weatherJSON = weatherJSONResult.value;
    }
    if (airportsJSONResult.status === "rejected") {
      console.error("Problema in airports", airportsJSONResult.reason);
    } else {
      airportsJSON = airportsJSONResult.value;
    }

    const destination = destinationJSON.length ? destinationJSON[0] : null;
    const weather = weatherJSON.length ? weatherJSON[0] : null;
    const airports = airportsJSON.length ? airportsJSON[0] : null;

    const resultObj = {
      city: destination ? destination.name : null,
      country: destination ? destination.country : null,
      temperature: weather ? weather.temperature : null,
      weather: weather ? weather.weather_description : null,
      airport: airports ? airports.name : null,
    };
    return resultObj;
  } catch (error) {
    console.error("Errore recupero dati ", error);
    throw error;
  }
}

getDashboardData("vienna")
  .then((data) => {
    console.log("Dasboard data:", data);
    console.log(
      `${data.city} is in ${data.country}.\n` +
        `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +
        `The main airport is ${data.airport}.\n`
    );
  })
  .catch((error) => console.error(error));
