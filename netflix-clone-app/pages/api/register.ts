import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import prismadb from '@/lib/prismadb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }

    const { email, name, password } = req.body;

    if (!email || !email.includes('@') || !name || !password) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const existingUser = await prismadb.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(422).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        emailVerified: null, // Important for credentials users
        image: null,
      }
    });

    return res.status(201).json({
      id: user.id,
      email: user.email,
      name: user.name
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ error: 'Registration failed' });
  }
}