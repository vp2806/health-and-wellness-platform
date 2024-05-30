"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MedicationActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MedicationActivity.belongsTo(models.medication, {
        foreignKey: "medication_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  MedicationActivity.init(
    {
      medication_id: DataTypes.INTEGER,
      done_at: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "medication_activities",
      underscored: true,
      timestamps: false,
    }
  );
  return MedicationActivity;
};
