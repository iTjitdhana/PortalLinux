'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('department', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      nameTh: {
        type: Sequelize.STRING(191),
        allowNull: false
      },
      nameEn: {
        type: Sequelize.STRING(191),
        allowNull: true
      },
      iconName: {
        type: Sequelize.STRING(191),
        allowNull: true
      },
      gradientClass: {
        type: Sequelize.STRING(191),
        allowNull: true
      },
      sortOrder: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
      },
      updatedAt: {
        type: Sequelize.DATE(3),
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)')
      }
    });

    // Add indexes
    await queryInterface.addIndex('department', ['sortOrder'], {
      name: 'Department_sortOrder_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('department');
  }
};
