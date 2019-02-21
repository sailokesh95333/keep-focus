import { getEndOfWeek, getStartOfWeek, minutesToString, timesToString, getWeekDatesList } from '../utils';

console.log(getStartOfWeek(60));
console.log(getEndOfWeek(60));

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