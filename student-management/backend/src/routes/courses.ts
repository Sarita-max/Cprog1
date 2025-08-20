import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { z } from 'zod';

const prisma = new PrismaClient();
const router = Router();

const courseSchema = z.object({
  code: z.string().min(2),
  title: z.string().min(1),
  description: z.string().min(1)
});

// List all courses (Admin only for manage view; public listing could be added if needed)
router.get('/', requireAuth, requireRole(['ADMIN']), async (_req, res) => {
  const courses = await prisma.course.findMany({ include: { enrollments: true } });
  res.json(courses);
});

router.post('/', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const course = await prisma.course.create({ data: parsed.data });
    res.status(201).json(course);
  } catch (e) {
    res.status(400).json({ error: 'Failed to create course' });
  }
});

router.put('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const id = Number(req.params.id);
  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  try {
    const course = await prisma.course.update({ where: { id }, data: parsed.data });
    res.json(course);
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
});

router.delete('/:id', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const id = Number(req.params.id);
  try {
    await prisma.course.delete({ where: { id } });
    res.status(204).send();
  } catch {
    res.status(404).json({ error: 'Not found' });
  }
});

router.post('/:id/enroll/:studentId', requireAuth, requireRole(['ADMIN']), async (req, res) => {
  const courseId = Number(req.params.id);
  const studentId = Number(req.params.studentId);
  try {
    const enrollment = await prisma.enrollment.create({ data: { courseId, studentId } });
    res.status(201).json(enrollment);
  } catch (e) {
    res.status(400).json({ error: 'Failed to enroll (duplicate or invalid ids)' });
  }
});

export default router;
