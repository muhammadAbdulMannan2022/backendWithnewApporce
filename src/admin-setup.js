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
        
        return {
          userCount,
          messageCount,
          roomCount,
          status: 'success'
        };
      } catch (error) {
        console.error('Dashboard handler error:', error);
        return { 
          userCount: 0, 
          messageCount: 0, 
          roomCount: 0,
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
      },
    },
    {
      resource: { model: AdminJSPrisma.getModelByName('Room'), client: prisma },
      options: {
        navigation: { name: 'Chat', icon: 'Chat' },
      },
    },
    {
      resource: { model: AdminJSPrisma.getModelByName('Message'), client: prisma },
      options: {
        navigation: { name: 'Chat', icon: 'Email' },
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
