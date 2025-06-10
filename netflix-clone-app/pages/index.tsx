import React, { memo } from 'react';

import Navbar from '@/components/Navbar';
import Billboard from '@/components/Billboard';
import MovieList from '@/components/MovieList';
import InfoModal from '@/components/InfoModal';
import useMovieList from '@/hooks/useMovieList';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import { getSession } from 'next-auth/react';
import { NextPageContext } from 'next';

interface Category {
  title: string;
  data: Array<{ id: string; title: string; thumbnailUrl: string; genre: string; duration: string; description: string; videoUrl: string }>;
  isLoading?: boolean;
  error?: Error | null;
}

const Home: React.FC = () => {
  const { data: movies = [], isLoading: moviesLoading, error: moviesError } = useMovieList();
  const { isOpen, closeModal } = useInfoModalStore();

  const categories: Category[] = [
    { title: 'Trending Now', data: movies, isLoading: moviesLoading, error: moviesError },
    { title: 'Classics', data: movies.filter((m: { genre: string | string[]; }) => m.genre.includes('Comedy') || m.genre.includes('Drama')), isLoading: moviesLoading, error: moviesError },
  ];

  return (
    <div className="bg-gray-900 min-h-screen">
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <Billboard />
      <div className="pb-16">
        {categories.map((category) => (
          <MovieList
            key={category.title}
            title={category.title}
            data={category.data}
            isLoading={category.isLoading}
            error={category.error}
          />
        ))}
      </div>
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default memo(Home);
