var Sequelize = require("sequelize");
const config = require('./config');
const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, config.db.params);

module.exports = sequelize;