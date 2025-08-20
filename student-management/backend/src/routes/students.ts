import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

const studentSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1)
});

// List students (Admin only)
router.get('/', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  const students = await prisma.student.findMany({ include: { user: true, enrollments: true } });
  res.json(students);
});

// Get own profile (Student) or by id (Admin)
router.get('/me', requireAuth, async (req, res) => {
  if (req.user?.role === 'STUDENT') {
    const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { student: { include: { enrollments: { include: { course: true } } } } } });
    return res.json(user?.student);
  }
  res.status(400).json({ error: 'Admins should use /:id' });
});

router.get('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const id = Number(req.params.id);
  const student = await prisma.student.findUnique({ where: { id }, include: { enrollments: { include: { course: true } }, user: true } });
  if (!student) return res.status(404).json({ error: 'Not found' });
  res.json(student);
});

// Create student (Admin)
router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const parsed = studentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const student = await prisma.student.create({ data: parsed.data });
  res.status(201).json(student);
});

// Update student (Admin)
router.put('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const id = Number(req.params.id);
  const parsed = studentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const student = await prisma.student.update({ where: { id }, data: parsed.data });
    res.json(student);
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
});

// Delete student (Admin)
router.delete('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.student.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
});

export default router;
