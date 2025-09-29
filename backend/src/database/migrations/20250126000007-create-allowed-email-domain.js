'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('allowedemaildomain', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      domain: {
        type: Sequelize.STRING(191),
        allowNull: false,
        unique: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE(3),
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
      }
    });

    // Add indexes
    await queryInterface.addIndex('allowedemaildomain', ['domain'], {
      unique: true,
      name: 'AllowedEmailDomain_domain_key'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('allowedemaildomain');
  }
};
