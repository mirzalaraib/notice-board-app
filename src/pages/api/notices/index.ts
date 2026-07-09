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
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
  }
}

// GET /api/notices - List all notices (Urgent first, then by publishDate desc)
async function handleGet(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [
        { priority: 'desc' }, // 'Urgent' priority comes first (defined second in schema enum)
        { publishDate: 'desc' },
      ],
    });
    return res.status(200).json({ success: true, data: notices });
  } catch (error) {
    console.error('Error fetching notices:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch notices' });
  }
}

// POST /api/notices - Create a new notice
async function handlePost(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    const { title, body, category, priority, publishDate, imageUrl } = req.body;

    // Server-side validation
    const errors: string[] = [];

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      errors.push('Title is required');
    }

    if (!body || typeof body !== 'string' || body.trim().length === 0) {
      errors.push('Body is required');
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

    if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
      try {
        const url = new URL(imageUrl.trim());
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          errors.push('Image URL must use http or https protocol');
        }
      } catch {
        errors.push('Image URL is not a valid URL format');
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join('; ') });
    }

    const notice = await prisma.notice.create({
      data: {
        title: title.trim(),
        body: body.trim(),
        category: category || 'General',
        priority: priority || 'Normal',
        publishDate: new Date(publishDate),
        imageUrl: imageUrl || null,
      },
    });

    return res.status(201).json({ success: true, data: notice });
  } catch (error) {
    console.error('Error creating notice:', error);
    return res.status(500).json({ success: false, error: 'Failed to create notice' });
  }
}