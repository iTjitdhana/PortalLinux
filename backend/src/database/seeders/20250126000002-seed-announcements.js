'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Insert sample announcements
    await queryInterface.bulkInsert('announcement', [
      {
        id: 1,
        title: 'ประชุมทีมพัฒนา',
        content: 'ประชุมทบทวนโปรเจคใหม่ วันพุธ 14:00 น.',
        type: 'meeting',
        isPublic: true,
        visibleFrom: new Date(),
        visibleTo: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdById: 1,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        title: 'อัพเดทระบบ',
        content: 'ระบบจะปิดปรับปรุงวันเสาร์ 02:00-06:00 น.',
        type: 'system',
        isPublic: true,
        visibleFrom: new Date(),
        visibleTo: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        createdById: 1,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 3,
        title: 'ทดสอบระบบ',
        content: 'ทดสอบการใช้งานระบบการจัดการแผนผลิตวันที่ 22 สิงหาคม เวลา 17:00-19:00 น.',
        type: 'system',
        isPublic: true,
        visibleFrom: new Date(),
        visibleTo: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        createdById: 1,
        createdAt: new Date(), // Just now
        updatedAt: new Date()
      },
      {
        id: 4,
        title: 'การอบรมพนักงานใหม่',
        content: 'การอบรมพนักงานใหม่จะจัดขึ้นในวันที่ 30 กันยายน 2568 เวลา 09:00-17:00 น. ณ ห้องประชุมใหญ่',
        type: 'meeting',
        isPublic: true,
        visibleFrom: new Date(),
        visibleTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        createdById: 1,
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000)
      },
      {
        id: 5,
        title: 'แจ้งเตือนการสำรองข้อมูล',
        content: 'ระบบจะทำการสำรองข้อมูลอัตโนมัติในคืนนี้ เวลา 02:00 น. อาจมีการชะลอการตอบสนองของระบบเล็กน้อย',
        type: 'system',
        isPublic: true,
        visibleFrom: new Date(),
        visibleTo: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        createdById: 1,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
      }
    ], {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('announcement', null, {});
  }
};
