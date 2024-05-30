"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.createTable(
          "medication_add_types",
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
            },
            type: {
              allowNull: false,
              type: Sequelize.STRING(15),
              unique: true,
            },
            created_at: {
              allowNull: false,
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP()"),
              type: Sequelize.DATE,
            },
            updated_at: {
              defaultValue: Sequelize.literal(
                "NULL ON UPDATE CURRENT_TIMESTAMP()"
              ),
              type: Sequelize.DATE,
            },
            deleted_at: {
              type: Sequelize.DATE,
            },
          },
          {
            transaction: t,
          }
        );
      });
    } catch (error) {
      console.error("Failed to create medication_add_types table", error);
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.dropTable("medication_add_types", {
          transaction: t,
        });
      });
    } catch (error) {
      console.error("Failed to down medication_add_types table", error);
    }
  },
};
