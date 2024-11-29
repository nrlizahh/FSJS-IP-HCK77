'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Note, {foreignKey : 'userId'})
    }
  }
  User.init({
    username:{
      type : DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg : "username required!"
        },
        notEmpty: {
          msg : "username required!"
        }
      }
    },   
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      isUnique: {
        args: true,
        msg: "email is already in use!",
      },
      validate: {
        notNull: {
          msg: "email required!",
        },
        notEmpty: {
          msg: "email required!",
        },
        isEmail: {
          msg: "must enter in email format",
        },
      },
    },
    picture: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};