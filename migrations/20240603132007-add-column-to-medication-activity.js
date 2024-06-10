"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.addColumn(
          "medication_activities",
          "notification_timestamp",
          {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal("CURRENT_TIMESTAMP()"),
          },
          {
            transaction: t,
          }
        );
        await queryInterface.changeColumn("medication_activities", "done_at", {
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("NULL ON UPDATE CURRENT_TIMESTAMP()"),
        });
      });
    } catch (error) {
      console.error(
        "Failed to add column to medication_activities table",
        error
      );
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.removeColumn(
          "medication_activities",
          "notification_date",
          {
            transaction: t,
          }
        );

        await queryInterface.changeColumn(
          "medication_activities",
          "done_at",
          {}
        );
      });
    } catch (error) {
      console.error(
        "Failed to drop column to medication_activities table",
        error
      );
    }
  },
};
