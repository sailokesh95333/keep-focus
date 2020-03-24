// # Tags API
// sets up all the Tags API methods

// import dependencies
import { manager } from '../sync-manager';
import { SuccessResponse } from './interfaces';
import { Logger, DebugLevel } from '../logger';

// define constants
const logger = new Logger('tags');

/** Status API Routes
* implements the Status API routes
*/

const read = function read(options: any, object: any) : SuccessResponse {
  const id = options.id;
  logger.green(`reveived NFC read tag with id: ${id}`);

  // update database and return status code
  return {
    success: manager.NFCTagScanned(id)
  };
}

export default {
  read
}