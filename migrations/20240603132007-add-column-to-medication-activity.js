"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.addColumn(
          "medication_activities",
          "notification_date",
          {
            allowNull: false,
            type: Sequelize.DATEONLY,
          },
          {
            transaction: t,
          }
        );
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
      });
    } catch (error) {
      console.error(
        "Failed to drop column to medication_activities table",
        error
      );
    }
  },
};
