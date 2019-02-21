// # Status API
// sets up all the Status API methods

// import dependencies
import { Response } from 'express';
import { manager } from '../sync-manager';
import { StatusResponse } from './interfaces';
import { minutesToString, timesToString, getEndOfWeek } from '../utils';
import { HabitItem, FocusItem } from '../sync-manager/interfaces';

/** Status API Routes
* implements the Status API routes
*/

const read = function read(options: any, object: any) : StatusResponse {
  // transform minutes to string
  let focus : FocusItem[] = manager.db.focus.map(item => {
    return {
      ...item,
      goal: minutesToString(item.goal as number),
      focused: minutesToString(item.focused as number)
    }
  });

  let habits : HabitItem[] = manager.db.habits.map(item => {
    return {
      ...item,
      goal: timesToString(item.goal as number),
      done: timesToString(item.done as number)
    }
  });

  // return response object
  return {
    utcOffset: manager.config.utcOffset,
    amountToBePaid: manager.config.amountToBePaid,
    twitterHandle: manager.config.twitterHandle,
    websiteDomain: manager.config.websiteDomain,
    remainingTime: minutesToString(manager.getRemainingMinutes()),
    focus,
    habits
  };
}

const render = async function render(options: any, object: any, res: Response) : Promise<any> {
  // render email verified
  return res.render('index', read(null, null));
}

export default {
  read,
  render
}