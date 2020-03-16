import { minutesToString, timesToString, getStartOfDay, getEndOfDay, getWeekDay, getTodaysDate, getEndOfSplit, remainingToTime } from '../utils';

console.log(getStartOfDay(1));
console.log(getEndOfDay(1));

console.log(minutesToString(120));
console.log(minutesToString(21));
console.log(minutesToString(61));
console.log(minutesToString(60));
console.log(minutesToString(1441));

console.log(timesToString(0));
console.log(timesToString(1));
console.log(timesToString(2));
console.log(timesToString(3));
console.log(timesToString(12));

console.log(getTodaysDate(1, 1577401299999));
console.log(getTodaysDate(0, 1584200258633));
console.log(getTodaysDate(8, 1584200258633));
console.log(getTodaysDate(-20, 1584200258633));

console.log(getWeekDay(0));
console.log(getWeekDay(7));
console.log(getWeekDay(8));
console.log(getWeekDay(-17));

console.log(getEndOfSplit(0, 720));
console.log(getEndOfSplit(1, 720));

console.log(remainingToTime(0));
console.log(remainingToTime(22));
console.log(remainingToTime(429));
console.log(remainingToTime(720));
console.log(remainingToTime(816));
console.log(remainingToTime(1428));
console.log(remainingToTime(1440));