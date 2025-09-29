'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('event', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING(191),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT('medium'),
        allowNull: true
      },
      startAt: {
        type: Sequelize.DATE(3),
        allowNull: false
      },
      endAt: {
        type: Sequelize.DATE(3),
        allowNull: false
      },
      allDay: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      externalProvider: {
        type: Sequelize.ENUM('google', 'microsoft'),
        allowNull: true
      },
      externalEventId: {
        type: Sequelize.STRING(191),
        allowNull: true
      },
      syncStatus: {
        type: Sequelize.ENUM('pending', 'synced', 'error'),
        allowNull: true
      },
      lastSyncedAt: {
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
    await queryInterface.addIndex('event', ['startAt', 'endAt'], {
      name: 'Event_startAt_endAt_idx'
    });
    
    await queryInterface.addIndex('event', ['createdById'], {
      name: 'Event_createdById_fkey'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('event');
  }
};
