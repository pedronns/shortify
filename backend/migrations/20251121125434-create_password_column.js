'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Links', 'passwordHash', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null
    })

    await queryInterface.addColumn('Links', 'protected', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    })
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.removeColumn('Links', 'protected')
   await queryInterface.removeColumn('Links', 'passwordHash')
  }
};
