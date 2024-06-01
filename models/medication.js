"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Medication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Medication.belongsTo(models.user, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      Medication.belongsTo(models.medication_add_type, {
        foreignKey: "medication_add_type_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  Medication.init(
    {
      user_id: DataTypes.INTEGER,
      medication_add_type_id: DataTypes.INTEGER,
      medication_name: DataTypes.STRING(50),
      description: DataTypes.STRING,
      day: DataTypes.TINYINT,
      time: DataTypes.STRING(9),
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "medication",
      underscored: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      deletedAt: "deleted_at",
    }
  );
  return Medication;
};
