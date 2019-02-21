const utils = require('./../server/utils');

let ms = utils.fromISOtoUnix('2019-01-06T16:52:30.835+00:00');
let iso = utils.fromUnixToISO(ms);
console.log(iso);

console.log(utils.getStartOfDay());
console.log(utils.getEndOfDay());