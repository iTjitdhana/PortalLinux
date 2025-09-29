const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Subsystem = sequelize.define('Subsystem', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  departmentId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'department',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(191),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  slug: {
    type: DataTypes.STRING(191),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  url: {
    type: DataTypes.STRING(191),
    allowNull: false,
    validate: {
      notEmpty: true,
      isUrl: true
    }
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  imageUrl: {
    type: DataTypes.STRING(191),
    allowNull: true
  }
}, {
  tableName: 'subsystem',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      fields: ['departmentId']
    },
    {
      fields: ['departmentId', 'sortOrder']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = Subsystem;
