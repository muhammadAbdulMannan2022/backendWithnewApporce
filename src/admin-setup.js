import AdminJS, { ComponentLoader } from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSPrisma from '@adminjs/prisma';
import { prisma } from './lib/prisma.js';
import { Prisma } from '@prisma/client';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentLoader = new ComponentLoader();

// THE KEY: Use the name 'Dashboard' and ensure absolute path
const DASHBOARD = componentLoader.add('Dashboard', path.join(__dirname, 'admin', 'components', 'overview.jsx'));
const RESOURCE_LIST = componentLoader.add('ResourceList', path.join(__dirname, 'admin', 'components', 'resource-list.jsx'));

AdminJS.registerAdapter({
  Database: AdminJSPrisma.Database,
  Resource: AdminJSPrisma.Resource,
});

const adminOptions = {
  dashboard: {
    handler: async (request, response, context) => {
      // Logic for fetching stats
      console.log('--- ADMIN DASHBOARD HANDLER CALLED ---');
      try {
        const userCount = await prisma.user.count();
        const messageCount = await prisma.message.count();
        const roomCount = await prisma.room.count();
        const errorCount = await prisma.errors.count();

        // Get daily error stats for the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const recentErrors = await prisma.errors.findMany({
          where: {
            createdAt: { gte: sevenDaysAgo }
          },
          select: { 
            createdAt: true,
            endpoint: true,
            flow_that_does_the_error: true,
          }
        });

        const dailyStats = {};
        const flowStats = {};
        const endpointStats = {};

        for(let i=0; i<7; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          dailyStats[date.toISOString().split('T')[0]] = 0;
        }

        recentErrors.forEach(err => {
          // Daily
          const day = err.createdAt.toISOString().split('T')[0];
          if(dailyStats[day] !== undefined) dailyStats[day]++;

          // Flow
          const flow = err.flow_that_does_the_error || 'Unknown';
          flowStats[flow] = (flowStats[flow] || 0) + 1;

          // Endpoint
          const ep = err.endpoint || 'Unknown';
          endpointStats[ep] = (endpointStats[ep] || 0) + 1;
        });

        const sortedDailyStats = Object.entries(dailyStats)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([day, count]) => ({ day, count }));

        const sortedFlowStats = Object.entries(flowStats)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5) // Top 5
          .map(([name, count]) => ({ name, count }));

        const sortedEndpointStats = Object.entries(endpointStats)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5) // Top 5
          .map(([name, count]) => ({ name, count }));

        return {
          userCount,
          messageCount,
          roomCount,
          errorCount,
          errorStats: sortedDailyStats,
          flowStats: sortedFlowStats,
          endpointStats: sortedEndpointStats,
          status: 'success'
        };
      } catch (error) {
        console.error('Dashboard handler error:', error);
        return { 
          userCount: 0, 
          messageCount: 0, 
          roomCount: 0,
          errorCount: 0,
          errorStats: [],
          status: 'error',
          error: error.message
        };
      }
    },
    component: DASHBOARD,
  },
  resources: [
    {
      resource: { model: AdminJSPrisma.getModelByName('User'), client: prisma },
      options: {
        navigation: { name: 'Management', icon: 'User' },
        actions: {
          list: {
            component: RESOURCE_LIST,
            after: async (response) => {
              const total = await prisma.user.count();
              const verified = await prisma.user.count({ where: { isVerified: true } });
              const today = await prisma.user.count({ where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } });
              response.meta = { ...response.meta, stats: { total, verified, newToday: today } };
              return response;
            },
          }
        }
      },
    },
    {
      resource: { model: AdminJSPrisma.getModelByName('Room'), client: prisma },
      options: {
        navigation: { name: 'Chat', icon: 'Chat' },
        actions: {
          list: {
            component: RESOURCE_LIST,
            after: async (response) => {
              const total = await prisma.room.count();
              const today = await prisma.room.count({ where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } });
              response.meta = { ...response.meta, stats: { total, createdToday: today } };
              return response;
            },
          }
        }
      },
    },
    {
      resource: { model: AdminJSPrisma.getModelByName('Message'), client: prisma },
      options: {
        navigation: { name: 'Chat', icon: 'Email' },
        actions: {
          list: {
            component: RESOURCE_LIST,
            after: async (response) => {
              const total = await prisma.message.count();
              const latestHour = await prisma.message.count({ where: { createdAt: { gte: new Date(Date.now() - 3600000) } } });
              response.meta = { ...response.meta, stats: { total, messagesLastHour: latestHour } };
              return response;
            },
          }
        }
      },
    },
    {
      resource: { model: AdminJSPrisma.getModelByName('Errors'), client: prisma },
      options: {
        navigation: { name: 'System', icon: 'Warning' },
        properties: {
          payload: { type: 'textarea' },
          stack: { type: 'textarea' },
        },
        actions: {
          list: {
            component: RESOURCE_LIST,
            after: async (response) => {
              const total = await prisma.errors.count();
              const today = await prisma.errors.count({ where: { createdAt: { gte: new Date(new Date().setHours(0,0,0,0)) } } });
              const uniqueEndpoints = (await prisma.errors.groupBy({ by: ['endpoint'] })).length;
              response.meta = { ...response.meta, stats: { total, loggedToday: today, distinctEndpoints: uniqueEndpoints } };
              return response;
            },
          }
        }
      },
    },
  ],
  branding: {
    companyName: 'Lantana Admin',
    withMadeWithLove: false,
    theme: {
      colors: {
        primary100: '#6366f1',
      },
      borderRadius: '8px',
    }
  },
  rootPath: '/admin',
  componentLoader,
};

const admin = new AdminJS(adminOptions);

const adminRouter = AdminJSExpress.buildAuthenticatedRouter(admin, {
  authenticate: async (email, password) => {
    try {
      const user = await prisma.user.findUnique({ 
        where: { email } 
      });

      if (user && user.role === 'ADMIN') {
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          return {
            email: user.email,
            title: 'Super Admin',
          };
        }
      }
      
      // Fallback to env variables if no admin user matches (optional, but keep for safety if desired)
      // Or just return null if not in DB
      const ENV_ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
      const ENV_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
      
      if (email === ENV_ADMIN_EMAIL && password === ENV_ADMIN_PASSWORD) {
          return {
              email: ENV_ADMIN_EMAIL,
              title: 'Super Admin (Env)',
          };
      }

      return null;
    } catch (error) {
      console.error('Admin authentication error:', error);
      return null;
    }
  },
  cookieName: 'adminjs-session',
  cookiePassword: process.env.COOKIE_PASSWORD || 'super-secret-password-at-least-32-chars-long',
}, null, {
  resave: false,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET || 'another-secret-at-least-32-chars-long',
  cookie: {
    httpOnly: true,
    secure: false, // development
    maxAge: 24 * 60 * 60 * 1000,
  }
});

export const initializeAdminUser = async () => {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@example.com';
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

  try {
    const adminExists = await prisma.user.findFirst({
      where: {
        role: 'ADMIN',
      },
    });

    if (!adminExists) {
      console.log('No admin user found in database. Creating default admin...');
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await prisma.user.create({
        data: {
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: 'ADMIN',
          isVerified: true,
        },
      });
      console.log(`Default admin created: ${ADMIN_EMAIL}`);
    } else {
      console.log('Admin user already exists in database.');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};

export { admin, adminRouter };
