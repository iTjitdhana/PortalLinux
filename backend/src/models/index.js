const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Department = require('./Department');
const Subsystem = require('./Subsystem');
const Announcement = require('./Announcement');
const Event = require('./Event');
const Identity = require('./Identity');
const AllowedEmailDomain = require('./AllowedEmailDomain');

// Define associations
const defineAssociations = () => {
  // User associations
  User.hasMany(Announcement, {
    foreignKey: 'createdById',
    as: 'announcements'
  });
  
  User.hasMany(Event, {
    foreignKey: 'createdById',
    as: 'events'
  });
  
  User.hasMany(Identity, {
    foreignKey: 'userId',
    as: 'identities'
  });

  // Department associations
  Department.hasMany(Subsystem, {
    foreignKey: 'departmentId',
    as: 'subsystems'
  });

  // Subsystem associations
  Subsystem.belongsTo(Department, {
    foreignKey: 'departmentId',
    as: 'department'
  });

  // Announcement associations
  Announcement.belongsTo(User, {
    foreignKey: 'createdById',
    as: 'creator'
  });

  // Event associations
  Event.belongsTo(User, {
    foreignKey: 'createdById',
    as: 'creator'
  });

  // Identity associations
  Identity.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

// Initialize associations
defineAssociations();

// Export all models
module.exports = {
  sequelize,
  User,
  Department,
  Subsystem,
  Announcement,
  Event,
  Identity,
  AllowedEmailDomain
};
