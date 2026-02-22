import prisma from '../config/database';
import { hashPassword } from '../utils/auth';

// Emails that cannot be edited
const PROTECTED_EMAILS = [
  'monchiant@sena.co.th',
  'adinuna@sena.co.th',
];

export const getUsersList = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  });
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      lastLoginAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });

  return users;
};

export const updateUser = async (
  userId: string,
  data: { name?: string; email?: string; role?: string }
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  if (PROTECTED_EMAILS.includes(user.email)) {
    throw new Error('This user cannot be edited');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.role && { role: data.role }),
    },
    select: { id: true, email: true, name: true, role: true },
  });

  return updated;
};

export const resetPassword = async (userId: string, newPassword: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  if (PROTECTED_EMAILS.includes(user.email)) {
    throw new Error('This user cannot be edited');
  }

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashed },
  });
};
