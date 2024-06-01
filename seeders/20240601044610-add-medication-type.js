"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.bulkInsert("medication_add_types", [
          {
            type: "One Time",
          },
          {
            type: "Daily",
          },
          {
            type: "Weekly",
          },
        ]);
      });
    } catch (error) {
      console.error(
        "Failed to insert data into medication_add_types table",
        error
      );
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.bulkDelete("medication_add_types", null, {});
      });
    } catch (error) {
      console.error(
        "Failed to delete data from medication_add_types table",
        error
      );
    }
  },
};
