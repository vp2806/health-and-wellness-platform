"use strict";
const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.bulkInsert(
          "users",
          [
            {
              first_name: "Vivek",
              last_name: "Panchal",
              email: "vivek@gmail.com",
              dob: new Date("2003-06-28"),
              contact_number: "1234567891",
              password: bcrypt.hashSync(
                process.env.ADMIN_PASSWORD,
                Number(process.env.SALT_ROUNDS)
              ),
              status: 1,
              created_at: new Date(new Date().getTime() + 330 * 1000 * 60),
            },
          ],
          {
            transaction: t,
          }
        );
      });
    } catch (error) {
      console.error("Failed to insert data into roles table", error);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async (t) => {
        await queryInterface.bulkDelete("users", null, {
          transaction: t,
        });
      });
    } catch (error) {
      console.error("Failed to delete data from roles table", error);
    }
  },
};
