"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.createTable(
          "users",
          {
            id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER,
            },
            first_name: {
              allowNull: false,
              type: Sequelize.STRING(50),
              validate: {
                isAlpha: true,
              },
            },
            last_name: {
              allowNull: false,
              type: Sequelize.STRING(50),
              validate: {
                isAlpha: true,
              },
            },
            email: {
              allowNull: false,
              type: Sequelize.STRING,
              unique: true,
              validate: {
                isEmail: true,
              },
            },
            dob: {
              allowNull: false,
              type: Sequelize.DATEONLY,
            },
            contact_number: {
              allowNull: false,
              type: Sequelize.STRING(10),
              unique: true,
            },
            password: {
              type: Sequelize.STRING,
            },
            activation_code: {
              type: Sequelize.STRING(16),
            },
            status: {
              allowNull: false,
              defaultValue: 0,
              type: Sequelize.BOOLEAN,
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
      console.error("Failed to create users table", error);
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.dropTable("users", {
          transaction: t,
        });
      });
    } catch (error) {
      console.error("Failed to down users table", error);
    }
  },
};
