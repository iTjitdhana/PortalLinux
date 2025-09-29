const { User, Announcement, Event, Department, Subsystem, sequelize } = require('../models');
const { Op } = require('sequelize');

// Get dashboard overview
const getOverview = async (req, res) => {
  try {
    const [
      totalUsers,
      activeUsers,
      totalAnnouncements,
      totalEvents,
      totalDepartments,
      totalSubsystems
    ] = await Promise.all([
      User.count(),
      User.count({ where: { status: 'active' } }),
      Announcement.count(),
      Event.count(),
      Department.count({ where: { isActive: true } }),
      Subsystem.count({ where: { isActive: true } })
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers,
          totalAnnouncements,
          totalEvents,
          totalDepartments,
          totalSubsystems
        }
      }
    });

  } catch (error) {
    console.error('Get overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get dashboard statistics
const getStats = async (req, res) => {
  try {
    const { period = '30' } = req.query; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    const [
      newUsers,
      newAnnouncements,
      newEvents,
      recentUsers
    ] = await Promise.all([
      User.count({
        where: {
          createdAt: {
            [Op.gte]: startDate
          }
        }
      }),
      Announcement.count({
        where: {
          createdAt: {
            [Op.gte]: startDate
          }
        }
      }),
      Event.count({
        where: {
          createdAt: {
            [Op.gte]: startDate
          }
        }
      }),
      User.findAll({
        where: {
          createdAt: {
            [Op.gte]: startDate
          }
        },
        order: [['createdAt', 'DESC']],
        limit: 5,
        attributes: ['id', 'email', 'fullName', 'createdAt']
      })
    ]);

    res.json({
      success: true,
      data: {
        stats: {
          period: `${period} days`,
          newUsers,
          newAnnouncements,
          newEvents,
          recentUsers
        }
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get recent activities
const getRecentActivities = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const [recentAnnouncements, recentEvents] = await Promise.all([
      Announcement.findAll({
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        include: [{
          model: User,
          as: 'creator',
          attributes: ['id', 'email', 'fullName']
        }],
        attributes: ['id', 'title', 'type', 'createdAt']
      }),
      Event.findAll({
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        include: [{
          model: User,
          as: 'creator',
          attributes: ['id', 'email', 'fullName']
        }],
        attributes: ['id', 'title', 'startAt', 'endAt', 'createdAt']
      })
    ]);

    // Combine and sort activities
    const activities = [
      ...recentAnnouncements.map(item => ({
        id: item.id,
        type: 'announcement',
        title: item.title,
        subtype: item.type,
        createdAt: item.createdAt,
        creator: item.creator
      })),
      ...recentEvents.map(item => ({
        id: item.id,
        type: 'event',
        title: item.title,
        startAt: item.startAt,
        endAt: item.endAt,
        createdAt: item.createdAt,
        creator: item.creator
      }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
     .slice(0, parseInt(limit));

    res.json({
      success: true,
      data: { activities }
    });

  } catch (error) {
    console.error('Get recent activities error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get user chart data
const getUserChartData = async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get daily user registrations
    const userData = await User.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']]
    });

    res.json({
      success: true,
      data: { userData }
    });

  } catch (error) {
    console.error('Get user chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get order chart data (placeholder)
const getOrderChartData = async (req, res) => {
  try {
    // This would be implemented based on your business logic
    res.json({
      success: true,
      data: {
        message: 'Order chart data not implemented yet'
      }
    });

  } catch (error) {
    console.error('Get order chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get revenue chart data (placeholder)
const getRevenueChartData = async (req, res) => {
  try {
    // This would be implemented based on your business logic
    res.json({
      success: true,
      data: {
        message: 'Revenue chart data not implemented yet'
      }
    });

  } catch (error) {
    console.error('Get revenue chart data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get notifications (placeholder)
const getNotifications = async (req, res) => {
  try {
    // This would be implemented based on your notification system
    res.json({
      success: true,
      data: {
        notifications: [],
        message: 'Notification system not implemented yet'
      }
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Mark notification as read (placeholder)
const markNotificationAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: 'Notification marked as read (placeholder)'
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Mark all notifications as read (placeholder)
const markAllNotificationsAsRead = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'All notifications marked as read (placeholder)'
    });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get subsystems with images
const getSubsystems = async (req, res) => {
  try {
    const { departmentId } = req.query;
    
    const whereClause = { isActive: true };
    if (departmentId) {
      whereClause.departmentId = departmentId;
    }

    const subsystems = await Subsystem.findAll({
      where: whereClause,
      include: [{
        model: Department,
        as: 'department',
        attributes: ['id', 'nameTh', 'nameEn']
      }],
      attributes: ['id', 'name', 'slug', 'url', 'imageUrl', 'sortOrder'],
      order: [['sortOrder', 'ASC'], ['name', 'ASC']]
    });

    res.json({
      success: true,
      data: { subsystems }
    });

  } catch (error) {
    console.error('Get subsystems error:', error);
    
    // Fallback: Return empty array when database is not available
    // This forces the user to upload images through the UI
    res.json({
      success: true,
      data: { subsystems: [] }
    });
  }
};

// Get subsystem by ID with image
const getSubsystemById = async (req, res) => {
  try {
    const { id } = req.params;

    const subsystem = await Subsystem.findOne({
      where: { 
        id: id,
        isActive: true 
      },
      include: [{
        model: Department,
        as: 'department',
        attributes: ['id', 'nameTh', 'nameEn']
      }],
      attributes: ['id', 'name', 'slug', 'url', 'imageUrl', 'sortOrder', 'createdAt', 'updatedAt']
    });

    if (!subsystem) {
      return res.status(404).json({
        success: false,
        message: 'Subsystem not found'
      });
    }

    res.json({
      success: true,
      data: { subsystem }
    });

  } catch (error) {
    console.error('Get subsystem by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      where: { isActive: true },
      include: [{
        model: Subsystem,
        as: 'subsystems',
        where: { isActive: true },
        required: false,
        attributes: ['id', 'name', 'slug', 'url', 'imageUrl', 'sortOrder']
      }],
      attributes: ['id', 'nameTh', 'nameEn', 'iconName', 'gradientClass', 'sortOrder'],
      order: [['sortOrder', 'ASC'], ['nameTh', 'ASC']]
    });

    res.json({
      success: true,
      data: { departments }
    });

  } catch (error) {
    console.error('Get departments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get announcements
const getAnnouncements = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const now = new Date();

    const announcements = await Announcement.findAll({
      where: {
        isPublic: true,
        [Op.and]: [
          {
            [Op.or]: [
              { visibleFrom: null },
              { visibleFrom: { [Op.lte]: now } }
            ]
          },
          {
            [Op.or]: [
              { visibleTo: null },
              { visibleTo: { [Op.gte]: now } }
            ]
          }
        ]
      },
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'email', 'fullName'],
        required: false
      }],
      attributes: ['id', 'title', 'content', 'type', 'isPublic', 'visibleFrom', 'visibleTo', 'createdAt', 'updatedAt'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: { announcements }
    });

  } catch (error) {
    console.error('Get announcements error:', error);
    
    // Fallback data when database is not available
    const fallbackAnnouncements = [
      {
        id: 1,
        title: "ประชุมทีมพัฒนา",
        content: "ประชุมทบทวนโปรเจคใหม่ วันพุธ 14:00 น.",
        type: "meeting",
        isPublic: true,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 2,
        title: "อัพเดทระบบ",
        content: "ระบบจะปิดปรับปรุงวันเสาร์ 02:00-06:00 น.",
        type: "system",
        isPublic: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 3,
        title: "ทดสอบระบบ",
        content: "ทดสอบการใช้งานระบบการจัดการแผนผลิตวันที่ 22 สิงหาคม เวลา 17:00-19:00 น.",
        type: "system",
        isPublic: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    res.json({
      success: true,
      data: { announcements: fallbackAnnouncements }
    });
  }
};

// Get events
const getEvents = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    const now = new Date();

    const events = await Event.findAll({
      where: {
        endAt: { [Op.gte]: now }
      },
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'email', 'fullName']
      }],
      attributes: ['id', 'title', 'description', 'startAt', 'endAt', 'allDay', 'createdAt', 'updatedAt'],
      order: [['startAt', 'ASC']],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: { events }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new announcement
const createAnnouncement = async (req, res) => {
  try {
    const { title, content, type = 'note', isPublic = true, visibleFrom, visibleTo } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    if (!['meeting', 'system', 'note'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid announcement type'
      });
    }

    // Create announcement
    const announcement = await Announcement.create({
      title,
      content,
      type,
      isPublic,
      visibleFrom: visibleFrom ? new Date(visibleFrom) : null,
      visibleTo: visibleTo ? new Date(visibleTo) : null,
      createdById: req.user?.userId || null
    });

    // Fetch the created announcement with creator info
    const createdAnnouncement = await Announcement.findByPk(announcement.id, {
      include: [{
        model: User,
        as: 'creator',
        attributes: ['id', 'email', 'fullName'],
        required: false
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Announcement created successfully',
      data: { announcement: createdAnnouncement }
    });

  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getOverview,
  getStats,
  getRecentActivities,
  getUserChartData,
  getOrderChartData,
  getRevenueChartData,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getSubsystems,
  getSubsystemById,
  getDepartments,
  getAnnouncements,
  getEvents,
  createAnnouncement
};
