import { getEndOfWeek, getStartOfWeek, minutesToString, timesToString, getWeekDatesList, getStartOfDay, getEndOfDay, getTodayDatesList } from '../utils';

console.log(getStartOfWeek(1));
console.log(getEndOfWeek(1));

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

console.log(getWeekDatesList(1, 1550444400000, 1551049199999));
console.log(getWeekDatesList(0, 1550444400000, 1551049199999));
console.log(getWeekDatesList(11520, 1550444400000, 1551049199999));

console.log(getTodayDatesList(1, 0, 1577401299999));