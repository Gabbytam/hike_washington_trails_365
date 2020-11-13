'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.entry.belongsTo(models.hike);
      models.entry.belongsTo(models.user);
    }
  };
  entry.init({
    body: DataTypes.TEXT,
    photo: DataTypes.BLOB,
    hikeId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'entry',
  });
  return entry;
};