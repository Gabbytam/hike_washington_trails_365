'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserHike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserHike.init({
    userId: DataTypes.INTEGER,
    hikeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserHike',
  });
  return UserHike;
};