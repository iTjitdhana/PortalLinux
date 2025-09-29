const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(191),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT('medium'),
    allowNull: true
  },
  startAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  allDay: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  externalProvider: {
    type: DataTypes.ENUM('google', 'microsoft'),
    allowNull: true
  },
  externalEventId: {
    type: DataTypes.STRING(191),
    allowNull: true
  },
  syncStatus: {
    type: DataTypes.ENUM('pending', 'synced', 'error'),
    allowNull: true
  },
  lastSyncedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdById: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'user',
      key: 'id'
    }
  }
}, {
  tableName: 'event',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['startAt', 'endAt']
    },
    {
      fields: ['createdById']
    },
    {
      fields: ['externalProvider', 'externalEventId']
    },
    {
      fields: ['syncStatus']
    }
  ]
});

module.exports = Event;
