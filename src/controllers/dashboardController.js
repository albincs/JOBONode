import { User, Project, Client, Team, Task, Testimonial, Contact, Award, Service } from '../models/index.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * Get comprehensive dashboard statistics with optional filters
 */
export const getDashboardStats = async (req, res) => {
  try {
    const { startDate, endDate, projectStatus } = req.query;
    
    // Build date filter if provided
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.created_at = {};
      if (startDate) dateFilter.created_at[Op.gte] = new Date(startDate);
      if (endDate) dateFilter.created_at[Op.lte] = new Date(endDate);
    }

    // Get current date for date-based calculations
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);

    // Parallel queries for better performance
    const [
      totalUsers,
      activeUsers,
      usersByRole,
      totalClients,
      totalProjects,
      completedProjects,
      ongoingProjects,
      upcomingProjects,
      totalRevenue,
      totalTeamMembers,
      totalTasks,
      completedTasks,
      recentContacts,
      totalTestimonials,
      totalAwards,
      totalServices,
      projectsByMonth,
      revenueByMonth,
      tasksByStatus
    ] = await Promise.all([
      // Users
      User.count(),
      User.count({ where: { is_active: true } }),
      User.findAll({
        attributes: [
          'role',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['role']
      }),
      
      // Clients
      Client.count(),
      
      // Projects
      Project.count(),
      Project.count({ where: { is_completed: true } }),
      Project.count({
        where: {
          is_completed: false,
          start_date: { [Op.lte]: now },
          [Op.or]: [
            { end_date: { [Op.gte]: now } },
            { end_date: null }
          ]
        }
      }),
      Project.count({
        where: {
          is_completed: false,
          start_date: { [Op.gt]: now }
        }
      }),
      
      // Revenue
      Project.sum('cost_estimation'),
      
      // Team
      Team.count(),
      
      // Tasks
      Task.count(),
      Task.count({ where: { is_completed: true } }),
      
      // Contacts (last 30 days)
      Contact.count({
        where: {
          created_at: { [Op.gte]: thirtyDaysAgo }
        }
      }),
      
      // Testimonials
      Testimonial.count(),
      
      // Awards
      Award.count(),
      
      // Services
      Service.count(),

      // Projects by month (last 6 months)
      Project.findAll({
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('start_date'), '%Y-%m'), 'month'],
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        where: {
          start_date: { [Op.gte]: sixMonthsAgo }
        },
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('start_date'), '%Y-%m')],
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('start_date'), '%Y-%m'), 'ASC']],
        raw: true
      }),

      // Revenue by month (last 6 months)
      Project.findAll({
        attributes: [
          [sequelize.fn('DATE_FORMAT', sequelize.col('start_date'), '%Y-%m'), 'month'],
          [sequelize.fn('SUM', sequelize.col('cost_estimation')), 'revenue']
        ],
        where: {
          start_date: { [Op.gte]: sixMonthsAgo }
        },
        group: [sequelize.fn('DATE_FORMAT', sequelize.col('start_date'), '%Y-%m')],
        order: [[sequelize.fn('DATE_FORMAT', sequelize.col('start_date'), '%Y-%m'), 'ASC']],
        raw: true
      }),

      // Tasks by completion status
      Task.findAll({
        attributes: [
          'is_completed',
          [sequelize.fn('COUNT', sequelize.col('id')), 'count']
        ],
        group: ['is_completed'],
        raw: true
      })
    ]);

    // Process user role breakdown
    const roleBreakdown = {};
    usersByRole.forEach(item => {
      roleBreakdown[item.role] = parseInt(item.dataValues.count);
    });

    // Calculate task completion rate
    const taskCompletionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    // Calculate project completion rate
    const projectCompletionRate = totalProjects > 0
      ? Math.round((completedProjects / totalProjects) * 100)
      : 0;

    // Prepare response
    const stats = {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
        byRole: roleBreakdown
      },
      clients: {
        total: totalClients
      },
      projects: {
        total: totalProjects,
        completed: completedProjects,
        ongoing: ongoingProjects,
        upcoming: upcomingProjects,
        completionRate: projectCompletionRate,
        byMonth: projectsByMonth
      },
      revenue: {
        total: totalRevenue || 0,
        formatted: new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 0
        }).format(totalRevenue || 0),
        byMonth: revenueByMonth
      },
      team: {
        total: totalTeamMembers
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
        pending: totalTasks - completedTasks,
        completionRate: taskCompletionRate,
        byStatus: tasksByStatus
      },
      contacts: {
        recent: recentContacts
      },
      testimonials: {
        total: totalTestimonials
      },
      awards: {
        total: totalAwards
      },
      services: {
        total: totalServices
      }
    };

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch dashboard statistics',
      message: error.message 
    });
  }
};
