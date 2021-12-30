const mongoose = require('mongoose');

const { dbHost, dbName, dbPort, dbUser, dbPass } = require('../app/config');

const connectionString = `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

mongoose.connect(connectionString);

const db = mongoose.connection;

module.exports = db;
