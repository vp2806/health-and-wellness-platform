"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.createTable(
          "medications",
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
            medication_add_type_id: {
              allowNull: false,
              type: Sequelize.INTEGER,
              references: {
                model: "medication_add_types",
                key: "id",
              },
              onDelete: "CASCADE",
              onUpdate: "CASCADE",
            },
            medication_name: {
              allowNull: false,
              type: Sequelize.STRING(50),
            },
            description: {
              allowNull: false,
              type: Sequelize.STRING,
            },
            day: {
              type: Sequelize.TINYINT,
            },
            start_date: {
              allowNull: false,
              type: Sequelize.DATE,
            },
            end_date: {
              type: Sequelize.DATE,
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
      console.error("Failed to create medications table", error);
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.dropTable("medications", {
          transaction: t,
        });
      });
    } catch (error) {
      console.error("Failed to down medications table", error);
    }
  },
};
