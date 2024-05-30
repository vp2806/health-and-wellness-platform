"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.createTable(
          "medication_activities",
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
            },
            medication_id: {
              allowNull: false,
              type: Sequelize.INTEGER,
              references: {
                model: "medications",
                key: "id",
              },
              onDelete: "CASCADE",
              onUpdate: "CASCADE",
            },
            done_at: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP()"),
            },
          },
          {
            transaction: t,
          }
        );
      });
    } catch (error) {
      console.error("Failed to create medication_activities table", error);
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.dropTable("medication_activities", {
          transaction: t,
        });
      });
    } catch (error) {
      console.error("Failed to down medication_activities table", error);
    }
  },
};
