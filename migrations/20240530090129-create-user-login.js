"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.createTable(
          "user_logins",
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
            token_id: {
              allowNull: false,
              type: Sequelize.STRING(32),
            },
            logged_in_at: {
              allowNull: false,
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal("CURRENT_TIMESTAMP()"),
            },
            logged_out_at: {
              type: Sequelize.DATE,
            },
            ip_address: {
              allowNull: false,
              type: Sequelize.STRING(39),
            },
            token_deleted: {
              type: Sequelize.DATE,
            },
            device: {
              allowNull: false,
              type: Sequelize.TEXT,
            },
          },
          {
            transaction: t,
          }
        );
      });
    } catch (error) {
      console.error("Failed to create user_logins table", error);
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.dropTable("user_logins", {
          transaction: t,
        });
      });
    } catch (error) {
      console.error("Failed to down user_logins table", error);
    }
  },
};
