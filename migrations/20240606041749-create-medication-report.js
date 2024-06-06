"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.createTable(
          "medication_reports",
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
            },
            user_id: {
              allowNull: false,
              type: Sequelize.INTEGER,
              references: {
                model: "users",
                key: "id",
              },
              onDelete: "CASCADE",
              onUpdate: "CASCADE",
            },
            report_url: {
              allowNull: false,
              type: Sequelize.STRING(2048),
            },
            created_at: {
              allowNull: false,
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP()"),
              type: Sequelize.DATE,
            },
          },
          {
            transaction: t,
          }
        );
      });
    } catch (error) {
      console.error("Failed to create medication_reports table", error);
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.dropTable("medication_reports", {
          transaction: t,
        });
      });
    } catch (error) {
      console.error("Failed to down medication_reports table", error);
    }
  },
};
