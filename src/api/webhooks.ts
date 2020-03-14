// # Webhook API
// sets up all the Webhook API methods

// import dependencies
import * as crypto from 'crypto';
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
  if (manager.db.punishmentIsActive) {
    // trying to disable punishment
    if (!options.password) {
      return {
        success: false,
        punishmentIsActive: manager.db.punishmentIsActive,
        message: 'tried to disable punishment without providing password'
      }
    }

    // make sure the hash is equal to the password
    const hashed = crypto.createHash('sha256').update(options.password, 'utf8').digest('hex');
    if (hashed !== manager.config.passwordHash) {
      return {
        success: false,
        punishmentIsActive: manager.db.punishmentIsActive,
        message: 'tried to disable punishment with incorrect password'
      }
    }
  }
  
  // trigger display both property
  manager.db.punishmentIsActive = !manager.db.punishmentIsActive;

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