const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(191),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  fullName: {
    type: DataTypes.STRING(191),
    allowNull: true,
    validate: {
      notEmpty: true
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    allowNull: false,
    defaultValue: 'active'
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'user',
  timestamps: true,
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['status']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Instance method to check if user is active
User.prototype.isActive = function() {
  return this.status === 'active';
};

// Static method to find user by email
User.findByEmail = function(email) {
  return this.findOne({ where: { email } });
};

// Static method to find active user by email
User.findActiveByEmail = function(email) {
  return this.findOne({ 
    where: { 
      email,
      status: 'active'
    } 
  });
};

module.exports = User;
