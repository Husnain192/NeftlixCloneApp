import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    await serverAuth(req, res);

    const { movieId } = req.query;

    if (!movieId || typeof movieId !== 'string') {
      return res.status(400).json({ error: 'Invalid movie ID' });
    }

    const movie = await prismadb.movie.findUnique({
      where: { id: movieId }
    });

    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    return res.status(200).json(movie);
  } catch (error) {
    console.error('Error in /api/[movieId]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}