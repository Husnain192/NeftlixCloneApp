import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    await serverAuth(req, res);

    const moviesCount = await prismadb.movie.count();
    if (moviesCount === 0) {
      return res.status(404).json({ error: 'No movies found' });
    }

    const randomIndex = Math.floor(Math.random() * moviesCount);
    const randomMovies = await prismadb.movie.findMany({
      take: 1,
      skip: randomIndex
    });

    if (!randomMovies.length) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    return res.status(200).json(randomMovies[0]);
  } catch (error) {
    console.error('Error in /api/random:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}