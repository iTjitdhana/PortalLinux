'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert sample users
    await queryInterface.bulkInsert('user', [
      {
        id: 1,
        email: 'admin@jitdhana.com',
        fullName: 'ผู้ดูแลระบบ',
        status: 'active',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        email: 'hr@jitdhana.com',
        fullName: 'ฝ่ายทรัพยากรบุคคล',
        status: 'active',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        email: 'production@jitdhana.com',
        fullName: 'ฝ่ายผลิต',
        status: 'active',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        email: 'it@jitdhana.com',
        fullName: 'ฝ่ายเทคโนโลยีสารสนเทศ',
        status: 'active',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        email: 'accounting@jitdhana.com',
        fullName: 'ฝ่ายบัญชี',
        status: 'active',
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user', null, {});
  }
};
