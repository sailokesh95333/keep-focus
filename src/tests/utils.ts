import { minutesToString, timesToString, getStartOfDay, getEndOfDay, getTodayDatesList, getWeekDay } from '../utils';

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

console.log(getTodayDatesList(1, 0, 1577401299999));
console.log(getTodayDatesList(-50, 0, 1584200258633));

console.log(getWeekDay(0));
console.log(getWeekDay(7));
console.log(getWeekDay(8));
console.log(getWeekDay(-17));