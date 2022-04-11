const axios = require('axios');
const moment = require('moment');

const keys = require('../../../config/keys');
const { nsRequester } = require('./../../../helpers/requesters');

function momentTimeWithTZOffset(timeString, tzOffset, unit = 'minutes') {
  return moment(timeString).add(tzOffset, unit);
}

module.exports = (app) => {
  app.get('/trains/stations', async (req, res) => {
    const { radius, lat, lon, name } = req.params;
    try {
      const response = await nsRequester.get(`/places-api/v2/places`, {
        params: {
          lat: lat || keys.LAT,
          lng: lon || keys.LON,
          type: 'stationV2',
          name,
          radius: radius || 500000,
        },
      });
      res.status(200).json(response.data);
    } catch (e) {
      return res.status(500).send(`error ${e}`);
    }
  });

  app.get('/trains/departures', async (req, res) => {
    const { station, limit } = req.query;

    try {
      const response = await nsRequester.get(
        `/reisinformatie-api/api/v2/departures`,
        {
          params: { station, maxJourneys: limit || 10 },
        },
      );
      res.status(200).json(response.data.payload.departures);
    } catch (e) {
      return res.status(500).send(`error ${e}`);
    }
  });

  app.get('/trains/journey', async (req, res) => {
    const {
      originLat,
      originLon,
      fromStation,
      destinationLat,
      destinationLon,
      toStation,
      originWalk = true,
      originBike = false,
      destinationWalk = true,
      destinationBike = false,
      discount,
    } = req.query;

    try {
      const response = await nsRequester.get(
        `/reisinformatie-api/api/v3/trips`,
        {
          params: {
            originLat,
            originLng: originLon,
            destinationLat,
            destinationLng: destinationLon,
            originWalk,
            originBike,
            destinationWalk,
            destinationBike,
            discount,
            fromStation,
            toStation,
          },
        },
      );
      const _trips = response.data.trips;
      // iterate through each trip
      const times = { earliest: null, latest: null };
      // go through each leg
      const trips = _trips
        .filter(
          (trip) =>
            momentTimeWithTZOffset(trip.legs[0].origin.plannedDateTime) >=
            moment(),
        )
        .map((trip) => {
          const legs = trip.legs;
          const originStartTimes = legs.map((leg) => {
            const tzOffset = leg.origin.plannedTimeZoneOffset;

            return momentTimeWithTZOffset(
              leg.origin.actualDateTime || leg.origin.plannedDateTime,
              tzOffset,
            );
          });
          const destinationEndTimes = legs.map((leg) => {
            const tzOffset = leg.destination.plannedTimeZoneOffset;
            return momentTimeWithTZOffset(
              leg.destination.actualDateTime || leg.destination.plannedDateTime,
              tzOffset,
            );
          });
          const earliestTime = moment.min(originStartTimes);
          const latestTime = moment.max(destinationEndTimes);
          return { trip, earliestTime, latestTime };
        });
      const earliestTime = moment.min(trips.map((trip) => trip.earliestTime));
      const latestTime = moment.max(trips.map((trip) => trip.latestTime));
      res.status(200).json({
        minStart: earliestTime,
        maxEnd: latestTime,
        trips: trips.map((t) => t.trip),
      });
    } catch (e) {
      return res.status(500).send(`error ${e}`);
    }
  });
};
