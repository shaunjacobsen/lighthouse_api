const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const keys = require('./config/keys');

// connect to mongodb on mLab
//mongoose.connect(keys.mongoURI);

// generates a new express app
const app = express();

// app.use enables middleware, used for every request that comes in

// bodyParser enables us to read the request body as req.body
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-instance");
  next();
});

// calls the functions from the files in routes/
require('./routes/modules/weather/routes')(app);
require('./routes/modules/transit/routes')(app);
// require('./routes/billingRoutes.js')(app);
// require('./routes/surveyRoutes.js')(app);

// if the routes above don't match the requested route, then it must be
// something on the client part of the application
// if (process.env.NODE_ENV === 'production') {
//   // Express serves production assets, such as main.js
//   app.use(express.static('client/build'));
//   // Express will serve index.html if it doesn't understand the route
//   const path = require('path');
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

const PORT = process.env.PORT || 4010;
app.listen(PORT, '0.0.0.0');
