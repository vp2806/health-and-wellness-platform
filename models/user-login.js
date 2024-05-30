"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserLogin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserLogin.belongsTo(models.user, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  UserLogin.init(
    {
      user_id: DataTypes.INTEGER,
      token_id: DataTypes.STRING(32),
      logged_in_at: DataTypes.DATE,
      logged_out_at: DataTypes.DATE,
      ip_address: DataTypes.STRING(39),
      token_deleted: DataTypes.DATE,
      device: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "user_login",
      indexes: [
        {
          fields: ["user_id", "token_id"],
          unique: true,
        },
      ],
      timestamps: false,
      underscored: true,
    }
  );
  return UserLogin;
};
