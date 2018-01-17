const axios = require('axios');
const keys = require('../../../config/keys');

module.exports = (app) => {
  app.get('/app/weather/', async (req, res) => {
    // TODO get coordinates
    try {
      const response = await axios.get(
        `${keys.lighthousePath}/api/weather/41.968069,-87.660087`
      );
      res.status(200).send(response.data);
    } catch (e) {
      res.status(500).send(`error ${e}`);
    }
  });
};
