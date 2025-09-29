-- Simple Data Seeder for Portal Linux
-- Run this after creating database and user

USE portal;

-- Create tables if not exists
CREATE TABLE IF NOT EXISTS `department` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nameTh` varchar(255) NOT NULL,
  `nameEn` varchar(255) NOT NULL,
  `iconName` varchar(255) DEFAULT NULL,
  `gradientClass` varchar(255) DEFAULT NULL,
  `sortOrder` int DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `subsystem` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `url` varchar(500) NOT NULL,
  `imageUrl` varchar(500) DEFAULT NULL,
  `sortOrder` int DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `departmentId` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `subsystem_departmentId_fkey` (`departmentId`),
  CONSTRAINT `subsystem_departmentId_fkey` FOREIGN KEY (`departmentId`) REFERENCES `department` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `announcement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text,
  `type` enum('info','warning','success','error') DEFAULT 'info',
  `isPublic` tinyint(1) DEFAULT 1,
  `visibleFrom` datetime DEFAULT NULL,
  `visibleTo` datetime DEFAULT NULL,
  `createdById` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `event` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `startAt` datetime NOT NULL,
  `endAt` datetime NOT NULL,
  `allDay` tinyint(1) DEFAULT 0,
  `createdById` int DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data
INSERT INTO `department` (`nameTh`, `nameEn`, `iconName`, `gradientClass`, `sortOrder`, `isActive`, `createdAt`, `updatedAt`) VALUES
('ระบบจัดการผลิต', 'Production Management', 'production', 'from-yellow-400 to-orange-500', 1, 1, NOW(), NOW()),
('ระบบงาน HR', 'HR System', 'hr', 'from-purple-400 to-pink-500', 2, 1, NOW(), NOW()),
('ระบบงาน บัญชี', 'Accounting System', 'accounting', 'from-pink-400 to-rose-500', 3, 1, NOW(), NOW()),
('ระบบงาน เทคโนโลยีสารสนเทศ (IT)', 'Information Technology', 'it', 'from-blue-400 to-cyan-500', 4, 1, NOW(), NOW()),
('ระบบงาน อาคาร', 'Building System', 'building', 'from-green-400 to-emerald-500', 5, 1, NOW(), NOW()),
('ระบบงาน RD', 'R&D System', 'rd', 'from-orange-400 to-red-500', 6, 1, NOW(), NOW());

INSERT INTO `subsystem` (`name`, `slug`, `url`, `imageUrl`, `sortOrder`, `isActive`, `departmentId`, `createdAt`, `updatedAt`) VALUES
('ระบบจัดการแผนการผลิต', 'production-planning', 'http://192.168.0.96:3012/', '/uploads/production-planning.svg', 1, 1, 1, NOW(), NOW()),
('ระบบจัดการกระบวนการผลิต', 'production-process', 'http://192.168.0.96:3013/', '/uploads/production-process.svg', 2, 1, 1, NOW(), NOW()),
('ตารางงานการผลิตสินค้าครัวกลาง', 'kitchen-schedule', 'http://192.168.0.96:3014/', '/uploads/kitchen-schedule.svg', 3, 1, 1, NOW(), NOW()),
('ระบบจับเวลาการผลิต', 'production-timing', 'http://192.168.0.96:3015/', '/uploads/production-timing.svg', 4, 1, 1, NOW(), NOW());

INSERT INTO `announcement` (`title`, `content`, `type`, `isPublic`, `visibleFrom`, `visibleTo`, `createdAt`, `updatedAt`) VALUES
('ประชุมทีมพัฒนา', 'ประชุมทบทวนโปรเจค ใหม่ วันพุธ 14:00 น.', 'info', 1, NULL, NULL, NOW(), NOW()),
('อัพเดทระบบ', 'ระบบจะปิดปรับปรุงวัน เสาร์ 02:00-06:00 น.', 'warning', 1, NULL, NULL, NOW(), NOW()),
('ทดสอบระบบ', 'ทดสอบการใช้งาน ระบบการจัดการแผน ผลิตวันที่ 22 สิงหาคม เวลา 17:00-19:00 น.', 'info', 1, NULL, NULL, NOW(), NOW());

INSERT INTO `event` (`title`, `description`, `startAt`, `endAt`, `allDay`, `createdAt`, `updatedAt`) VALUES
('ประชุมทีมพัฒนา', 'ประชุมทบทวนโปรเจค ใหม่', '2025-09-30 14:00:00', '2025-09-30 16:00:00', 0, NOW(), NOW()),
('อัพเดทระบบ', 'ระบบจะปิดปรับปรุง', '2025-10-05 02:00:00', '2025-10-05 06:00:00', 0, NOW(), NOW());
