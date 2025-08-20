import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@example.com';
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { email: adminEmail, password: adminPassword, role: Role.ADMIN }
  });

  const studentPassword = await bcrypt.hash('student123', 10);
  await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      email: 'student1@example.com',
      password: studentPassword,
      role: Role.STUDENT,
      student: {
        create: { firstName: 'Alice', lastName: 'Anderson' }
      }
    }
  });

  await prisma.course.upsert({
    where: { code: 'CS101' },
    update: {},
    create: { code: 'CS101', title: 'Intro to CS', description: 'Basics of computer science' }
  });
  await prisma.course.upsert({
    where: { code: 'MATH201' },
    update: {},
    create: { code: 'MATH201', title: 'Linear Algebra', description: 'Vectors and matrices' }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
