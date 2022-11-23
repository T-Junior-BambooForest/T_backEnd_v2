'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Board', 'Image', {
      type: Sequelize.DataTypes.BLOB('long')
    });
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('Board', 'Image', {
      type: Sequelize.DataTypes.STRING
    });
  }
};
