// # Express Application
// sets up the express API endpoints

// import dependencies
import * as express from 'express';
import * as path from 'path';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import config from './configuration';
import * as middleware from './middleware';
import * as api from './api';
import { manager } from './sync-manager';
const app = express();

// setup and start synchronization manager
manager.setup().then(() => {
  manager.start();
});

// use bodyparser middleware for url and json parsing
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// set the view engine to ejs
app.set('view engine', 'ejs');

// use morgan to log requests to the console
app.use(morgan(config.get('express:morgan')));

// disable powered by
app.disable('x-powered-by');

// allow cors
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// return 200 for all options
app.use('*', function(req, res, next) {
  if (req.method === 'OPTIONS') {
    res.status(200);
    res.end();
  } else {
    next();
  }
});

export function addRoutes() : void {
  // # status routes
  app.get('/api/status', api.http(api.status.read));

  // # webhook routes
  app.get('/api/webhooks/lametric', api.http(api.webhooks.lametric));
  app.get('/api/webhooks/togglePunishment', api.http(api.webhooks.togglePunishment));

  // # render files
  app.get('/', api.render(api.status.render) );
 
  // # serve static files
  app.use('/', express.static(path.join(__dirname, '..' ,'public'), {
    extensions: ['html']
  }));
}

export function addErrorRoutes() : void {
  // # error routes
  // handles request the remanining requests, which results in a 404 Not Found
  app.use(middleware.error.resourceNotFound);
  // handles all unhandled errors
  app.use(middleware.error.handleError);
}

// export for use elsewhere
export default app;
