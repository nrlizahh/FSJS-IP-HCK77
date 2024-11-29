'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Note.belongsTo(models.User, {foreignKey: 'userId'})
      Note.belongsTo(models.Status, {foreignKey: 'statusId'})

    }
  }
  Note.init({
    task:{
      type : DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : "task required!"
        },
        notEmpty: {
          msg : "task required!"
        }
      }
    },   
    description:{
      type : DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg : "description required!"
        },
        notEmpty: {
          msg : "description required!"
        }
      }
    },   
    userId: DataTypes.INTEGER,
    statusId: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    order: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Note',
  });
  return Note;
};