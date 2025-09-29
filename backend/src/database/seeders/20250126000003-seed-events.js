'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert sample events
    await queryInterface.bulkInsert('event', [
      {
        id: 1,
        title: 'ประชุมประจำสัปดาห์',
        description: 'ประชุมทบทวนงานประจำสัปดาห์และวางแผนงานสัปดาห์ถัดไป',
        startAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 9 * 60 * 60 * 1000), // 2 days from now at 9:00 AM
        endAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 2 days from now at 10:00 AM
        allDay: false,
        createdById: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        title: 'การอบรมระบบใหม่',
        description: 'การอบรมการใช้งานระบบจัดการผลิตเวอร์ชันใหม่',
        startAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 13 * 60 * 60 * 1000), // 5 days from now at 1:00 PM
        endAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 17 * 60 * 60 * 1000), // 5 days from now at 5:00 PM
        allDay: false,
        createdById: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        title: 'วันหยุดประจำปี',
        description: 'วันหยุดประจำปีของบริษัท',
        startAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        endAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
        allDay: true,
        createdById: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        title: 'การตรวจสอบระบบ',
        description: 'การตรวจสอบและบำรุงรักษาระบบ IT ประจำเดือน',
        startAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000), // 7 days from now at 6:00 PM
        endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 20 * 60 * 60 * 1000), // 7 days from now at 8:00 PM
        allDay: false,
        createdById: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        title: 'การประชุมคณะกรรมการ',
        description: 'การประชุมคณะกรรมการบริหารประจำเดือน',
        startAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000), // 14 days from now at 2:00 PM
        endAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 16 * 60 * 60 * 1000), // 14 days from now at 4:00 PM
        allDay: false,
        createdById: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('event', null, {});
  }
};
