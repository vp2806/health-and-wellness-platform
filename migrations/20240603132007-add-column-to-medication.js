"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.addColumn(
          "medications",
          "authentication_code",
          {
            type: Sequelize.STRING(64),
          },
          {
            validate: {
              isAlphanumeric: true,
            },
            transaction: t,
          }
        );
      });
    } catch (error) {
      console.error("Failed to add column to medications table", error);
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.removeColumn(
          "medications",
          "authentication_code",
          {
            transaction: t,
          }
        );
      });
    } catch (error) {
      console.error("Failed to drop column to medications table", error);
    }
  },
};
