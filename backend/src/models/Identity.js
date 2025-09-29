const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Identity = sequelize.define('Identity', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  provider: {
    type: DataTypes.ENUM('google', 'oidc', 'saml', 'ldap', 'proxy'),
    allowNull: false
  },
  providerUserId: {
    type: DataTypes.STRING(191),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(191),
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  rawProfileJson: {
    type: DataTypes.JSON,
    allowNull: true
  },
  linkedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'identity',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['provider', 'providerUserId']
    },
    {
      fields: ['userId']
    },
    {
      fields: ['provider']
    }
  ]
});

module.exports = Identity;
