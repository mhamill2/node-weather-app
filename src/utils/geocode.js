const request = require('postman-request');

const geocode = (address, callback) => {
  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=pk.eyJ1IjoibWljaGFlbGhhbWlsbDYxNCIsImEiOiJja3B4YWFsdWsyMjc1Mm9xYzYydDN0cjJ3In0.Ah693xLFI1Gh4qnmK_s8Gw&limit=1`;

  request({ url: url, json: true }, (error, { body }) => {
    if (error) {
      callback('Unable to connect to location services.');
      return;
    } else if (body.features.length < 1) {
      callback('Unable to find location. Try another search.');
      return;
    }

    callback(undefined, {
      lattitude: body.features[0].center[1],
      longitude: body.features[0].center[0],
      location: body.features[0].place_name
    });
  });
};

module.exports = geocode;
