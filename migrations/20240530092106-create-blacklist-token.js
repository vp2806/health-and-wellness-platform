"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.createTable(
          "blacklist_tokens",
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
            },
            token: {
              allowNull: false,
              type: Sequelize.TEXT,
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
          },
          {
            transaction: t,
          }
        );
      });
    } catch (error) {
      console.error("Failed to create blacklist_tokens table", error);
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.dropTable("blacklist_tokens", {
          transaction: t,
        });
      });
    } catch (error) {
      console.error("Failed to down blacklist_tokens table", error);
    }
  },
};
