'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn("Board", "ImageLink", {
      type: Sequelize.STRING,
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.removeColumn("Board", "ImageLink")
  }
};
