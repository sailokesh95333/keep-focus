// import dependencies
import * as moment from 'moment';

export const getStartOfDay = function getStartOfDay(timezone: number) : number {
  return moment().startOf('day').add(-1*timezone, 'hours').valueOf();
}

export const getEndOfDay = function getEndOfDay(timezone: number) : number {
  return moment().endOf('day').add(-1*timezone, 'hours').valueOf();
}

export const minutesToString = function minutesToString(minutes: number) : string {
  let m = moment.duration(minutes, 'minutes');
  return m.days() ? `${m.days()}d ${m.hours()}h ${m.minutes()}m` : `${m.hours()}h ${m.minutes()}m`;
}

export const timesToString = function timesToString(times: number) : string {
  return (times == 1) ? '1 time' : `${times} times`;
}

export const getWeekDay = function getWeekDay(timezone: number) : string {
  return moment().add(timezone, 'hours').format('dd').toLowerCase();
}

// TODO: utcOffset does not actually affect the date. what do we do here?
export const getTodayDatesList = function getTodayDatesList(timezone: number, start: number, end: number) : string[] {
  return [moment(end).utcOffset(timezone).format('DDMMYYYY')];
}