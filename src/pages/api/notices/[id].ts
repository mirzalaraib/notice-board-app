import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

type ResponseData = {
  success: boolean;
  data?: unknown;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { id } = req.query;
  const noticeId = parseInt(id as string, 10);

  if (isNaN(noticeId)) {
    return res.status(400).json({ success: false, error: 'Invalid notice ID' });
  }

  switch (req.method) {
    case 'GET':
      return handleGet(req, res, noticeId);
    case 'PUT':
      return handlePut(req, res, noticeId);
    case 'DELETE':
      return handleDelete(req, res, noticeId);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}

// GET /api/notices/[id] - Get a single notice
async function handleGet(req: NextApiRequest, res: NextApiResponse<ResponseData>, id: number) {
  try {
    const notice = await prisma.notice.findUnique({ where: { id } });

    if (!notice) {
      return res.status(404).json({ success: false, error: 'Notice not found' });
    }

    return res.status(200).json({ success: true, data: notice });
  } catch (error) {
    console.error('Error fetching notice:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch notice' });
  }
}

// PUT /api/notices/[id] - Update a notice
async function handlePut(req: NextApiRequest, res: NextApiResponse<ResponseData>, id: number) {
  try {
    // Check if notice exists
    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Notice not found' });
    }

    const { title, body, category, priority, publishDate, imageUrl } = req.body;

    // Server-side validation
    const errors: string[] = [];

    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      errors.push('Title cannot be empty');
    }

    if (body !== undefined && (typeof body !== 'string' || body.trim().length === 0)) {
      errors.push('Body cannot be empty');
    }

    if (publishDate) {
      const parsedDate = new Date(publishDate);
      if (isNaN(parsedDate.getTime())) {
        errors.push('Publish date is invalid');
      }
    }

    if (category && !['Exam', 'Event', 'General'].includes(category)) {
      errors.push('Category must be one of: Exam, Event, General');
    }

    if (priority && !['Normal', 'Urgent'].includes(priority)) {
      errors.push('Priority must be one of: Normal, Urgent');
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join('; ') });
    }

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title.trim();
    if (body !== undefined) updateData.body = body.trim();
    if (category !== undefined) updateData.category = category;
    if (priority !== undefined) updateData.priority = priority;
    if (publishDate !== undefined) updateData.publishDate = new Date(publishDate);
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl || null;

    const notice = await prisma.notice.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json({ success: true, data: notice });
  } catch (error) {
    console.error('Error updating notice:', error);
    return res.status(500).json({ success: false, error: 'Failed to update notice' });
  }
}

// DELETE /api/notices/[id] - Delete a notice
async function handleDelete(req: NextApiRequest, res: NextApiResponse<ResponseData>, id: number) {
  try {
    const existing = await prisma.notice.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Notice not found' });
    }

    await prisma.notice.delete({ where: { id } });

    return res.status(200).json({ success: true, data: { message: 'Notice deleted successfully' } });
  } catch (error) {
    console.error('Error deleting notice:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete notice' });
  }
}