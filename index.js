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
    const destination = destinationJSON[0];
    const weather = weatherJSON[0];
    const airports = airportsJSON[0];

    const resultObj = {
      city: destination?.name,
      country: destination?.country,
      temperature: weather?.temperature,
      weather: weather?.weather_description,
      airport: airports?.name,
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
