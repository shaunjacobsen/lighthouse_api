// keys.js - determine which credentials to return
// NODE_ENV variable tells us which environment we're on
if (process.env.NODE_ENV === 'production') {
  // return production set of keys
  module.exports = require('./prod.js');
} else {
  // return development set of keys
  module.exports = require('./dev.js');
}
