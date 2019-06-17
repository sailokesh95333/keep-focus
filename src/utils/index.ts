// import dependencies
import * as moment from 'moment';

export const getStartOfWeek = function getStartOfWeek(timezone: number) : number {
  return moment().startOf('isoWeek').utcOffset(timezone).valueOf();
}

export const getEndOfWeek = function getEndOfWeek(timezone: number) : number {
  return moment().endOf('isoWeek').utcOffset(timezone).valueOf();
}

export const getStartOfDay = function getStartOfDay(timezone: number) : number {
  return moment().startOf('day').utcOffset(timezone).valueOf();
}

export const getEndOfDay = function getEndOfDay(timezone: number) : number {
  return moment().endOf('day').utcOffset(timezone).valueOf();
}

export const minutesToString = function minutesToString(minutes: number) : string {
  let m = moment.duration(minutes, 'minutes');
  return m.days() ? `${m.days()}d ${m.hours()}h ${m.minutes()}m` : `${m.hours()}h ${m.minutes()}m`;
}

export const timesToString = function timesToString(times: number) : string {
  return (times == 1) ? '1 time' : `${times} times`;
}

export const getWeekDatesList = function getWeekDatesList(timezone: number, start: number, end: number) : string[] {
  let dates = [];
  for (let date = moment(start).utcOffset(timezone); date.valueOf() <= end; date.add(1, 'days')) {
    dates.push(date.format('DDMMYYYY'));
  }
  return dates;
}

export const getTodayDatesList = function getTodayDatesList(timezone: number, start: number, end: number) : string[] {
  return [moment(end).utcOffset(timezone).format('DDMMYYYY')];
}