const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Announcement = sequelize.define('Announcement', {
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
  content: {
    type: DataTypes.TEXT('medium'),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  type: {
    type: DataTypes.ENUM('meeting', 'system', 'note'),
    allowNull: false,
    defaultValue: 'note'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  visibleFrom: {
    type: DataTypes.DATE,
    allowNull: true
  },
  visibleTo: {
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
  tableName: 'announcement',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['createdAt']
    },
    {
      fields: ['visibleFrom', 'visibleTo']
    },
    {
      fields: ['createdById']
    },
    {
      fields: ['type']
    },
    {
      fields: ['isPublic']
    }
  ]
});

module.exports = Announcement;
