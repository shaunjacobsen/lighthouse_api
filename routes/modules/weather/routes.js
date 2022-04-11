const axios = require('axios');
const keys = require('../../../config/keys');

module.exports = (app) => {
  app.get('/weather/', async (req, res) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather`,
        {
          params: {
            lat: keys.LAT,
            lon: keys.LON,
            appid: keys.WEATHER_API_KEY,
            units: 'metric',
          },
        },
      );
      res.status(200).send(response.data);
    } catch (e) {
      res.status(500).send(`error ${e}`);
    }
  });
};
