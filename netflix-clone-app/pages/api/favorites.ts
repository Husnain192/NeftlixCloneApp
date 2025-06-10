import { NextApiRequest, NextApiResponse } from "next";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const { currentUser } = await serverAuth(req, res);

    if (!currentUser?.favoriteIds?.length) {
      return res.status(200).json([]);
    }

    const favoritedMovies = await prismadb.movie.findMany({
      where: { id: { in: currentUser.favoriteIds } }
    });

    return res.status(200).json(favoritedMovies);
  } catch (error) {
    console.error('Error in /api/favorites:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}