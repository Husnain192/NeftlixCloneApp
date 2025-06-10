import React, { memo } from 'react';
import { useRouter } from 'next/router';

import Navbar from '@/components/Navbar';
import MovieList from '@/components/MovieList';
import useMovieList from '@/hooks/useMovieList';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import { getSession } from 'next-auth/react';
import { NextPageContext } from 'next';
import InfoModal from '@/components/InfoModal';

const SearchPage: React.FC = () => {
  const router = useRouter();
  const { q: searchTerm = '' } = router.query;
  const { data: movies = [], isLoading, error } = useMovieList();
  const { isOpen, closeModal } = useInfoModalStore();

  const filteredMovies = movies.filter((movie: { title: string; }) =>
    movie.title.toLowerCase().includes((searchTerm as string).toLowerCase()),
  );

  return (
    <div className="bg-gray-900 min-h-screen">
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <div className="pt-20 pb-16">
        <MovieList
          title={`Search Results for "${searchTerm}"`}
          data={filteredMovies}
          isLoading={isLoading}
          error={error}
        />
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

export default memo(SearchPage)