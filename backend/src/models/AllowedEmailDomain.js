const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const AllowedEmailDomain = sequelize.define('AllowedEmailDomain', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  domain: {
    type: DataTypes.STRING(191),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  }
}, {
  tableName: 'allowedemaildomain',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: false,
  indexes: [
    {
      unique: true,
      fields: ['domain']
    },
    {
      fields: ['isActive']
    }
  ]
});

module.exports = AllowedEmailDomain;
