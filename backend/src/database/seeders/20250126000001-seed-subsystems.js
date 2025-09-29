'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // First, let's insert some departments if they don't exist
    await queryInterface.bulkInsert('department', [
      {
        id: 1,
        nameTh: 'ระบบจัดการผลิต',
        nameEn: 'Production Management',
        iconName: 'Factory',
        gradientClass: 'bg-gradient-to-br from-amber-400 to-orange-600',
        sortOrder: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        nameTh: 'ระบบงาน HR',
        nameEn: 'Human Resources',
        iconName: 'Users',
        gradientClass: 'bg-gradient-to-br from-blue-400 to-indigo-600',
        sortOrder: 2,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        nameTh: 'ระบบงานบัญชี',
        nameEn: 'Accounting',
        iconName: 'Calculator',
        gradientClass: 'bg-gradient-to-br from-purple-400 to-pink-500',
        sortOrder: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        nameTh: 'ระบบงานเทคโนโลยีสารสนเทศ (IT)',
        nameEn: 'Information Technology',
        iconName: 'Monitor',
        gradientClass: 'bg-gradient-to-br from-cyan-400 to-blue-600',
        sortOrder: 4,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        nameTh: 'ระบบงานอาคาร',
        nameEn: 'Building Management',
        iconName: 'Building2',
        gradientClass: 'bg-gradient-to-br from-emerald-400 to-teal-600',
        sortOrder: 5,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        nameTh: 'ระบบงาน RD',
        nameEn: 'Research & Development',
        iconName: 'UtensilsCrossed',
        gradientClass: 'bg-gradient-to-br from-orange-400 to-red-500',
        sortOrder: 6,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {
      ignoreDuplicates: true
    });

    // Insert subsystems with real imageUrl from database
    await queryInterface.bulkInsert('subsystem', [
      {
        id: 1,
        departmentId: 1,
        name: 'ระบบจัดการแผนการผลิต',
        slug: 'production-planning',
        url: 'http://192.168.0.96:3012/',
        sortOrder: 1,
        isActive: true,
        imageUrl: '/uploads/1757043766162-edlba0-_.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        departmentId: 1,
        name: 'ระบบจัดการกระบวนการผลิต',
        slug: 'production-process',
        url: 'http://192.168.0.93/tracker/index.html',
        sortOrder: 2,
        isActive: true,
        imageUrl: '/uploads/1757043800339-a70zxm-_.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        departmentId: 1,
        name: 'ระบบจับเวลาการผลิต',
        slug: 'production-timing',
        url: 'http://192.168.0.94:3012/tracker',
        sortOrder: 3,
        isActive: true,
        imageUrl: '/uploads/1757043809131-ml076j-_.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        departmentId: 1,
        name: 'ตารางงานการผลิตสินค้าครัวกลาง',
        slug: 'kitchen-schedule',
        url: 'http://192.168.0.94:3013/',
        sortOrder: 4,
        isActive: true,
        imageUrl: '/uploads/1757043816953-6yiejr-_.png',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        departmentId: 1,
        name: 'ต้นทุน',
        slug: 'cost',
        url: 'http://192.168.0.94:3015/',
        sortOrder: 5,
        isActive: true,
        imageUrl: '/uploads/1757043820000-cost-_.png',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {
      ignoreDuplicates: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subsystem', null, {});
    await queryInterface.bulkDelete('department', null, {});
  }
};
