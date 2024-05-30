"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      first_name: DataTypes.STRING(50),
      last_name: DataTypes.STRING(50),
      email: DataTypes.STRING,
      dob: DataTypes.DATEONLY,
      contact_number: DataTypes.STRING(10),
      password: DataTypes.STRING,
      activation_code: DataTypes.STRING(16),
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "user",
      underscored: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return User;
};
