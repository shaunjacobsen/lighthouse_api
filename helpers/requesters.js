const axios = require('axios');
const keys = require('../config/keys');

const nsRequester = axios.create({
  baseURL: 'https://gateway.apiportal.ns.nl',
  headers: { 'Ocp-Apim-Subscription-Key': keys.NS_KEY },
});

module.exports = { nsRequester };
