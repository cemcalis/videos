import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getServerSession } from 'next-auth/next';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return await getVideos(req, res);
    case 'POST':
      return await createVideo(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function getVideos(req: NextApiRequest, res: NextApiResponse) {
  try {
    const {
      page = '1',
      limit = '20',
      category,
      search,
      uploader,
      sort = 'created_at',
      order = 'desc',
      is_premium,
      is_short
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    let query = supabase
      .from('videos')
      .select(`
        *,
        profiles:uploader_id (
          username,
          full_name,
          avatar_url
        ),
        categories:category_id (
          name,
          color
        )
      `)
      .eq('status', 'published')
      .range(offset, offset + limitNum - 1);

    // Apply filters
    if (category) {
      query = query.eq('category_id', category);
    }

    if (uploader) {
      query = query.eq('uploader_id', uploader);
    }

    if (is_premium !== undefined) {
      query = query.eq('is_premium', is_premium === 'true');
    }

    if (is_short !== undefined) {
      query = query.eq('is_short', is_short === 'true');
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    const validSortFields = ['created_at', 'views', 'likes', 'title'];
    const sortField = validSortFields.includes(sort as string) ? sort : 'created_at';
    const sortOrder = order === 'asc' ? 'asc' : 'desc';

    query = query.order(sortField as any, { ascending: sortOrder === 'asc' });

    const { data: videos, error, count } = await query;

    if (error) throw error;

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('videos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published');

    res.status(200).json({
      videos,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: totalCount,
        pages: Math.ceil((totalCount || 0) / limitNum),
      },
    });

  } catch (error: any) {
    console.error('Get videos error:', error);
    res.status(500).json({ error: error.message });
  }
}

async function createVideo(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getServerSession(req);
    if (!session?.user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      title,
      description,
      video_url,
      thumbnail_url,
      duration,
      category_id,
      tags,
      is_premium,
      is_short,
      file_size
    } = req.body;

    if (!title || !video_url || !category_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { data: video, error } = await supabase
      .from('videos')
      .insert({
        title,
        description,
        video_url,
        thumbnail_url,
        duration,
        category_id,
        tags: tags || [],
        uploader_id: session.user.id,
        is_premium: is_premium || false,
        is_short: is_short || false,
        file_size,
        status: 'published',
      })
      .select(`
        *,
        profiles:uploader_id (
          username,
          full_name,
          avatar_url
        ),
        categories:category_id (
          name,
          color
        )
      `)
      .single();

    if (error) throw error;

    res.status(201).json({ video });

  } catch (error: any) {
    console.error('Create video error:', error);
    res.status(500).json({ error: error.message });
  }
}
