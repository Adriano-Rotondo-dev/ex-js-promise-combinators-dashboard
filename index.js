async function getDashboardData(query) {
  try {
    const [destinationResponse, weatherResponse, airportsResponse] =
      await Promise.all([
        fetch(`http://localhost:3333/destinations?search=${query}`),
        fetch(`http://localhost:3333/weathers?search=${query}`),
        fetch(`http://localhost:3333/airports?search=${query}`),
      ]);
    const [destinationJSON, weatherJSON, airportsJSON] = await Promise.all([
      destinationResponse.json(),
      weatherResponse.json(),
      airportsResponse.json(),
    ]);
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

getDashboardData("london")
  .then((data) => {
    console.log("Dasboard data:", data);
    console.log(
      `${data.city} is in ${data.country}.\n` +
        `Today there are ${data.temperature} degrees and the weather is ${data.weather}.\n` +
        `The main airport is ${data.airport}.\n`
    );
  })
  .catch((error) => console.error(error));
