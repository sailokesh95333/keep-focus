const Forest = require('../server/forest');

const client = new Forest('609525', '4dad67d8a4ae7d692a80569fd82cdef509b161a5', 'http://localhost:8888');
client.getAllPlantsSince('2019-01-06T14:23:58.001Z');