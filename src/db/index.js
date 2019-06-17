// # Database
// sets up the database and its functions for usage
'use strict';

// import dependencies
const loki = require('lokijs');

class Database {
  constructor({ databaseName, collections }) {
    // set up constants
    this._autosaveInterval = 4000;
    this._collections = collections;
    this._colls = {};

    // create new database
    this._db = new loki(databaseName, {
      autosave: true,
      autosaveInterval: this._autosaveInterval
    });
  }

  init() {
    return new Promise((resolve, reject) => {
      this._db.loadDatabase({}, (err) => {
        if (err) return reject(err);

        // database loaded successfully
        this._initializeDatabase();
        return resolve();
      });
    });
  }

  close() {
    this._db.close();
  }

  getAllCollections() {
    return this._colls;
  }

  getCollection(name) {
    return this._colls[name];
  }

  _initializeDatabase() {
    for (const collection of this._collections) {
      if (!this._db.getCollection(collection)) {
        this._colls[collection] = this._db.addCollection(collection);
      } else {
        this._colls[collection] = this._db.getCollection(collection);
      }
    }
  }
}

// export for usage elsewhere
module.exports = Database;