'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class hike extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  hike.init({
    title: DataTypes.STRING,
    region: DataTypes.STRING,
    imgUrl: DataTypes.STRING,
    height: DataTypes.FLOAT,
    distance: DataTypes.STRING,
    description: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'hike',
  });
  return hike;
};