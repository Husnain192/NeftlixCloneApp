import { NextApiRequest, NextApiResponse } from "next";
import { without } from "lodash";
import prismadb from '@/lib/prismadb';
import serverAuth from "@/lib/serverAuth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'POST') {
      const { currentUser } = await serverAuth(req, res);
      const { movieId } = req.body;

      if (!movieId || typeof movieId !== 'string') {
        return res.status(400).json({ error: 'Invalid movie ID' });
      }

      const existingMovie = await prismadb.movie.findUnique({
        where: { id: movieId }
      });

      if (!existingMovie) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      const user = await prismadb.user.update({
        where: { email: currentUser.email || '' },
        data: { favoriteIds: { push: movieId } }
      });

      return res.status(200).json(user);
    }

    if (req.method === 'DELETE') {
      const { currentUser } = await serverAuth(req, res);
      const { movieId } = req.query;

      if (!movieId || typeof movieId !== 'string') {
        return res.status(400).json({ error: 'Invalid movie ID' });
      }

      const existingMovie = await prismadb.movie.findUnique({
        where: { id: movieId }
      });

      if (!existingMovie) {
        return res.status(404).json({ error: 'Movie not found' });
      }

      const updatedFavoriteIds = without(currentUser.favoriteIds, movieId);

      const updatedUser = await prismadb.user.update({
        where: { email: currentUser.email || '' },
        data: { favoriteIds: updatedFavoriteIds }
      });

      return res.status(200).json(updatedUser);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error in /api/favorite:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}