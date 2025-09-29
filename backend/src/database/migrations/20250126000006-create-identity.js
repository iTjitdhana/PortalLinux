'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('identity', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      provider: {
        type: Sequelize.ENUM('google', 'oidc', 'saml', 'ldap', 'proxy'),
        allowNull: false
      },
      providerUserId: {
        type: Sequelize.STRING(191),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(191),
        allowNull: true
      },
      rawProfileJson: {
        type: Sequelize.JSON,
        allowNull: true
      },
      linkedAt: {
        type: Sequelize.DATE(3),
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP(3)')
      }
    });

    // Add indexes
    await queryInterface.addIndex('identity', ['provider', 'providerUserId'], {
      unique: true,
      name: 'Identity_provider_providerUserId_key'
    });
    
    await queryInterface.addIndex('identity', ['userId'], {
      name: 'Identity_userId_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('identity');
  }
};
