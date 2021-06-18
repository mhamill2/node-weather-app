const path = require('path');
const hbs = require('hbs');
const express = require('express');

const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public'); // Serves up the entire public directory in the browser
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs'); // Express expects all views to be in the root project directory
app.set('views', viewsPath); // You can customize the path to your views with this line
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather App',
    name: 'Michael Hamill'
  }); // render will serve up the index file in the views directory
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Michael Hamill'
  });
});

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help Page',
    message: 'This is the help page',
    name: 'Michael Hamill'
  });
});

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address.'
    });
  }

  const address = req.query.address;

  geocode(address, (error, { lattitude, longitude, location } = {}) => {
    if (error) {
      return res.send({ error });
    }

    forecast(lattitude, longitude, (error, forecastData) => {
      if (error) {
        return res.send({ error });
      }

      res.send({
        location,
        forecast: forecastData,
        address
      });
    });
  });
});

app.get('/help/*', (req, res) => {
  res.render('404', {
    errorMessage: 'Help article not found.',
    title: '404',
    name: 'Michael Hamill'
  });
});

// The wildcard character will match any path
// that doesn't match anything else in the public folder or other routes that have been set up
app.get('*', (req, res) => {
  res.render('404', {
    errorMessage: 'Page not found.',
    title: '404',
    name: 'Michael Hamill'
  });
});

// app.com
// app.com/help
// app.com/about

app.listen(3000, () => {
  console.log('Server is up on port 3000.');
});
