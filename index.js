const express = require('express');
const pg = require('pg');
const { rateLimiter } = require('./rateLimiter');

//  Define API rate limit here
const reqLimit = 3;
const reqTimeLimit = 2000;
let permitRequest = true;

const app = express();
// configs come from standard PostgreSQL env vars
// https://www.postgresql.org/docs/9.6/static/libpq-envars.html
const pool = new pg.Pool();

const queryHandler = (req, res, next) => {
  pool.query(req.sqlQuery).then((r) => res.json(r.rows || []))
    .catch(next);
};

//  Serve static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.get('/', (req, res) => {
  //  Check to see if request is permitted before sending a response
  permitRequest = rateLimiter(reqLimit, reqTimeLimit);
  if (permitRequest === true) res.send('Welcome to EQ Works 😎');
  else res.status(429).send(`<h1>429 Too Many Requests!</h1> \n <h3>Please try again in ${reqTimeLimit / 1000} seconds</h3>`);
});

app.get('/events/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `;
  //  Check if request is permitted before querying DB and sending response
  permitRequest = rateLimiter(reqLimit, reqTimeLimit);
  if (permitRequest === true) return next();
  res.status(429).send(`<h1>429 Too Many Requests!</h1> \n <h3>Please try again in ${reqTimeLimit / 1000} seconds</h3>`);
}, queryHandler);

app.get('/events/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `;
  //  Check if request is permitted before querying DB and sending response
  permitRequest = rateLimiter(reqLimit, reqTimeLimit);
  if (permitRequest === true) return next();
  res.status(429).send(`<h1>429 Too Many Requests!</h1> \n <h3>Please try again in ${reqTimeLimit / 1000} seconds</h3>`);
}, queryHandler);

app.get('/stats/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
  `;
  //  Check if request is permitted before querying DB and sending response
  permitRequest = rateLimiter(reqLimit, reqTimeLimit);
  if (permitRequest === true) return next();
  res.status(429).send(`<h1>429 Too Many Requests!</h1> \n <h3>Please try again in ${reqTimeLimit / 1000} seconds</h3>`);
}, queryHandler);

app.get('/stats/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date,
        SUM(impressions) AS impressions,
        SUM(clicks) AS clicks,
        SUM(revenue) AS revenue
    FROM public.hourly_stats
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `;
  //  Check if request is permitted before querying DB and sending response
  permitRequest = rateLimiter(reqLimit, reqTimeLimit);
  if (permitRequest === true) return next();
  res.status(429).send(`<h1>429 Too Many Requests!</h1> \n <h3>Please try again in ${reqTimeLimit / 1000} seconds</h3>`);
}, queryHandler);

app.get('/poi', (req, res, next) => {
  req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `;
  //  Check if request is permitted before querying DB and sending response
  permitRequest = rateLimiter(reqLimit, reqTimeLimit);
  if (permitRequest === true) return next();
  res.status(429).send(`<h1>429 Too Many Requests!</h1> \n <h3>Please try again in ${reqTimeLimit / 1000} seconds</h3>`);
}, queryHandler);

app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  } else {
    console.log(`Running on ${process.env.PORT || 5555}`);
  }
});

// last resorts
process.on('uncaughtException', (err) => {
  console.log(`Caught exception: ${err}`);
  process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  process.exit(1);
});
