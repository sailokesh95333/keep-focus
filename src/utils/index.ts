// import dependencies
import * as moment from 'moment';

export const getStartOfDay = function getStartOfDay(timezone: number) : number {
  return moment().add(timezone, 'hours').startOf('day').add(-1*timezone, 'hours').valueOf();
}

export const getEndOfDay = function getEndOfDay(timezone: number) : number {
  return moment().add(timezone, 'hours').endOf('day').add(-1*timezone, 'hours').valueOf();
}

export const getEndOfSplit = function getEndOfSplit(timezone: number, remainingMinutes: number) : number {
  return moment().add(timezone, 'hours').endOf('day').add(-1*timezone, 'hours').add(-1*remainingMinutes, 'minutes').valueOf();
}

export const getRemainingMinutesInDay = function getRemainingMinutesInDay(timezone: number) : number {
  let end = moment().add(timezone, 'hours').endOf('day').add(-1*timezone, 'hours');
  let start = moment();
  let duration = moment.duration(end.diff(start));
  return Math.ceil(duration.asMinutes());
}

export const getNow = function getNow() : number {
  return moment().valueOf();
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

export const getTodaysDate = function getTodaysDate(timezone: number, end: number) : string {
  return moment(end).add(timezone, 'hours').format('DDMMYYYY');
}

export const remainingToTime = function remainingToTime(remainingMinutes: number) : string {
  if (remainingMinutes <= 0) return '12:00 am';
  let minutesProgressed = 1440 - remainingMinutes;
  let period = 'am';
  if (minutesProgressed >= 720) {
    minutesProgressed -= 720;
    period = 'pm';
  }
  // calculate hours and minutes
  const minutes = minutesProgressed % 60;
  let hours = Math.floor(minutesProgressed / 60);
  
  // translate to readable format
  if (hours == 0) hours = 12;
  const minutesStr = (minutes < 10) ? '0' + minutes : minutes;
  return `${hours}:${minutesStr} ${period}`;
}

export const arrayContains = function arrayContains(arr: any[], item: any) : boolean {
  return arr.indexOf(item) > -1;
}