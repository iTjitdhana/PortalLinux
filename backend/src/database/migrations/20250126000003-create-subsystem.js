'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subsystem', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      departmentId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'department',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      name: {
        type: Sequelize.STRING(191),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(191),
        allowNull: false,
        unique: true
      },
      url: {
        type: Sequelize.STRING(191),
        allowNull: false
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
      imageUrl: {
        type: Sequelize.STRING(191),
        allowNull: true
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
    await queryInterface.addIndex('subsystem', ['slug'], {
      unique: true,
      name: 'Subsystem_slug_key'
    });
    
    await queryInterface.addIndex('subsystem', ['departmentId'], {
      name: 'Subsystem_departmentId_idx'
    });
    
    await queryInterface.addIndex('subsystem', ['departmentId', 'sortOrder'], {
      name: 'Subsystem_departmentId_sortOrder_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subsystem');
  }
};
