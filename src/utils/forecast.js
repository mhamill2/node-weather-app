const request = require('postman-request');

const forecast = (lattitude, longitude, callback) => {
  const url = `http://api.weatherstack.com/current?access_key=ce601e64fade1a1eb9926110e4edb4e9&query=${lattitude},${longitude}&units=f`;
  request({ url, json: true }, (error, { body }) => {
    if (error) {
      return callback('Unable to contact weather service.');
    } else if (body.error) {
      return callback('Unable to find location');
    }

    const current = body.current;
    callback(
      undefined,
      `${current.weather_descriptions[0]}. It is currently ${current.temperature} degrees out. It feels like ${current.feelslike} degrees out`
    );
  });
};

module.exports = forecast;
