const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  nameTh: {
    type: DataTypes.STRING(191),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  nameEn: {
    type: DataTypes.STRING(191),
    allowNull: true
  },
  iconName: {
    type: DataTypes.STRING(191),
    allowNull: true
  },
  gradientClass: {
    type: DataTypes.STRING(191),
    allowNull: true
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
  }
}, {
  tableName: 'department',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      fields: ['sortOrder']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = Department;
