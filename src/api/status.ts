// # Status API
// sets up all the Status API methods

// import dependencies
import { Response } from 'express';
import { manager } from '../sync-manager';
import { StatusResponse, ItemResponse } from './interfaces';
import { HabitItem, FocusItem, SplitItem } from '../sync-manager/interfaces';
import { minutesToString, timesToString, getEndOfSplit, getNow, remainingToTime, getRemainingMinutesInDay } from '../utils';

/** Status API Routes
* implements the Status API routes
*/

const read = function read(options: any, object: any) : StatusResponse {
  const focusItems = manager.db.focus.filter(item => item.isActive);
  const focus : ItemResponse[] = focusItems.map(item => {
    return transformToResponse(item);
  });

  const habitItems = manager.db.habits.filter(item => item.isActive).concat(manager.db.nfc.filter(item => item.isActive));
  const habits : ItemResponse[] = habitItems.map(item => {
    return transformToResponse(item, true);
  });

  // return response object
  return {
    utcOffset: manager.config.utcOffset,
    username: manager.config.username,
    websiteDomain: manager.config.websiteDomain,
    punishmentIsActive: manager.db.punishmentIsActive,
    remainingTime: minutesToString(getRemainingMinutesInDay(manager.config.utcOffset)),
    totalAmount: manager.db.totalAmount,
    currentAmount:  manager.db.currentAmount,
    focus,
    habits
  };
}

const transformToResponse = function transformToResponse(item: FocusItem | HabitItem, isHabit: boolean = false) : ItemResponse {
  // add default end-of-day split
  const defaultItem = {
    goal: item.goal,
    done: item.done,
    amount: item.amount,
    remainingMinutes: 0,
  };
  const items: SplitItem[] = [ defaultItem, ...item.splits ];

  // find currently active split
  const now = getNow();

  console.log(items);
  let currentSplit: SplitItem = null;
  items.forEach(split => {
    const endOfSplit = getEndOfSplit(manager.config.utcOffset, split.remainingMinutes);
    console.log('now ', now, 'end', endOfSplit);
    if (endOfSplit >= now && (!currentSplit || split.remainingMinutes > currentSplit.remainingMinutes)) {
      currentSplit = split;
    }
  });

  // return transformed item
  const toString = isHabit ? timesToString : minutesToString;
  return {
    id: item.id,
    name: item.name,
    amount: currentSplit.amount,
    goal: toString(currentSplit.goal),
    done: toString(currentSplit.done),
    finishedBefore: remainingToTime(currentSplit.remainingMinutes)
  }
}

const render = async function render(options: any, object: any, res: Response) : Promise<any> {
  // render email verified
  return res.render('index', read(null, null));
}

export default {
  read,
  render
}