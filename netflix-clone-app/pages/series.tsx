import Navbar from '@/components/Navbar';
import MovieList from '@/components/MovieList';
import useMovieList from '@/hooks/useMovieList';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import InfoModal from '@/components/InfoModal';
import { getSession } from 'next-auth/react';
import { NextPageContext } from 'next';
import { memo } from 'react';

const Series: React.FC = () => {
  const { data: movies = [], isLoading, error } = useMovieList();
  const { isOpen, closeModal } = useInfoModalStore();

  const seriesMovies = movies.filter((movie: { genre: string | string[]; }) => movie.genre.includes('Drama')); // Adjust filter as needed

  return (
    <div className="bg-gray-900 min-h-screen">
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <div className="pt-20 pb-16">
        <MovieList
          title="Series"
          data={seriesMovies}
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

export default memo(Series);