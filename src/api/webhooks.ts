// # Webhook API
// sets up all the Webhook API methods

// import dependencies
import { manager } from '../sync-manager';

/** Webhook API Routes
* implements the Webhook API routes
*/

const lametric = function lametric(options: any, object: any) : any {
  // trigger display both property
  manager.db.displayBoth = !manager.db.displayBoth;
  manager.pushLametric();

  // return response object
  return {
    success: true,
    displayBoth: manager.db.displayBoth
  };
}

const discord = function discord(options: any, object: any) : any {
  // trigger display both property
  manager.db.discordActive = !manager.db.discordActive;

  // return response object
  return {
    success: true,
    discordActive: manager.db.discordActive
  };
}

export default {
  lametric,
  discord
}