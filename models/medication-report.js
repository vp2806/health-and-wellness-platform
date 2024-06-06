"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MedicationReport extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MedicationReport.belongsTo(models.user, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  MedicationReport.init(
    {
      user_id: DataTypes.INTEGER,
      report_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "medication_report",
      underscored: true,
      updatedAt: false,
      createdAt: "created_at",
    }
  );
  return MedicationReport;
};
