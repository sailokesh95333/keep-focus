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

const togglePunishment = function togglePunishment(options: any, object: any) : any {
  // trigger display both property
  manager.db.punishmentIsActive = !manager.db.punishmentIsActive;
  
  // check current status and require password if want to disable
  console.log(options.password);

  // return response object
  return {
    success: true,
    punishmentIsActive: manager.db.punishmentIsActive
  };
}

export default {
  lametric,
  togglePunishment
}