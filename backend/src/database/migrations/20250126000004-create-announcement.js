'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('announcement', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(191),
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT('medium'),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('meeting', 'system', 'note'),
        allowNull: false,
        defaultValue: 'note'
      },
      isPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      visibleFrom: {
        type: Sequelize.DATE(3),
        allowNull: true
      },
      visibleTo: {
        type: Sequelize.DATE(3),
        allowNull: true
      },
      createdById: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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
    await queryInterface.addIndex('announcement', ['createdAt'], {
      name: 'Announcement_createdAt_idx'
    });
    
    await queryInterface.addIndex('announcement', ['visibleFrom', 'visibleTo'], {
      name: 'Announcement_visibleFrom_visibleTo_idx'
    });
    
    await queryInterface.addIndex('announcement', ['createdById'], {
      name: 'Announcement_createdById_fkey'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('announcement');
  }
};
