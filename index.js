const express = require('express');
const cookieSession = require('cookie-session');
const pg = require('pg');
const rateLimiter = require('./rateLimiter');

//  Define API rate limit here
const reqLimit = 4;
const reqTimeLimit = 1000;

const app = express();

// Add cookie-session middleware to be used for distinguishing requests from more than one client
// while also handling number of requests made. Cookie age will be limited to rate time limit thus
// the rate-limiter function only needs to check the number of requests for a given cookie
app.use(cookieSession({
  name: 'session',
  keys: ['EQ', 'Works'],
  // Cookie Options
  maxAge: reqTimeLimit, // Same as reqTimeLimit set above
}));

// Add custom rate-limiter middleware
app.use((req, res, next) => {
  req.session.numRequests = (req.session.numRequests || 0) + 1;
  if (rateLimiter(req.session.numRequests, reqLimit)) return next();
  return res.status(429).send(`<h1>429 Too Many Requests!</h1> \n <h3>Please try again in ${reqTimeLimit / 1000} seconds</h3>`);
});

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
  res.send('Welcome to EQ Works 😎');
});

app.get('/events/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, events
    FROM public.hourly_events
    ORDER BY date, hour
    LIMIT 168;
  `;
  return next();
}, queryHandler);

app.get('/events/daily', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, SUM(events) AS events
    FROM public.hourly_events
    GROUP BY date
    ORDER BY date
    LIMIT 7;
  `;
  return next();
}, queryHandler);

app.get('/stats/hourly', (req, res, next) => {
  req.sqlQuery = `
    SELECT date, hour, impressions, clicks, revenue
    FROM public.hourly_stats
    ORDER BY date, hour
    LIMIT 168;
  `;
  return next();
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
  return next();
}, queryHandler);

app.get('/poi', (req, res, next) => {
  req.sqlQuery = `
    SELECT *
    FROM public.poi;
  `;
  return next();
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
