import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSPrisma from '@adminjs/prisma';
import { prisma } from './lib/prisma.js';
import { Prisma } from '@prisma/client';

// Register the adapter
AdminJS.registerAdapter({
  Database: AdminJSPrisma.Database,
  Resource: AdminJSPrisma.Resource,
});

const adminOptions = {
  resources: [
    {
      resource: { model: AdminJSPrisma.getModelByName('User'), client: prisma },
      options: {
        navigation: { name: 'User Management', icon: 'Users' },
        properties: {
          password: { isVisible: { list: false, edit: true, filter: false, show: false } },
          refreshToken: { isVisible: false },
          otp: { isVisible: false },
          otpExpiry: { isVisible: false },
        },
      },
    },
    {
      resource: { model: AdminJSPrisma.getModelByName('Room'), client: prisma },
      options: {
        navigation: { name: 'Chat System', icon: 'MessageSquare' },
      },
    },
    {
      resource: { model: AdminJSPrisma.getModelByName('Message'), client: prisma },
      options: {
        navigation: { name: 'Chat System', icon: 'Mail' },
      },
    },
  ],
  branding: {
    companyName: 'Lantana Admin',
    withMadeWithLove: false,
    theme: {
      colors: {
        primary100: '#6366f1', // Indigo 500
      }
    }
  },
  rootPath: '/admin',
};

const admin = new AdminJS(adminOptions);

// Build router
const adminRouter = AdminJSExpress.buildRouter(admin);

export { admin, adminRouter };
