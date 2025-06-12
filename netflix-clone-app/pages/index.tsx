import React, { memo } from 'react';
import dynamic from 'next/dynamic';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Dynamically import components that rely on client-side features
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), {
  ssr: false,
});
const Navbar = dynamic(() => import('@/components/Navbar'), { ssr: false });
const Billboard = dynamic(() => import('@/components/Billboard'), { ssr: false });
const InfoModal = dynamic(() => import('@/components/InfoModal'), { ssr: false });
const MovieList = dynamic(() => import('@/components/MovieList'), { ssr: false });

import useMovieList from '@/hooks/useMovieList';
import useInfoModalStore from '@/hooks/useInfoModalStore';

// Loading spinner component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-600"></div>
  </div>
);

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
    { title: 'Classics', data: movies.filter((m: { genre: string | string[] }) => m.genre.includes('Comedy') || m.genre.includes('Drama')), isLoading: moviesLoading, error: moviesError },
  ];

  React.useEffect(() => {
    if (moviesError) {
      toast.error(`Error loading movies: ${moviesError.message}`);
    }
  }, [moviesError]);

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-gray-800 min-h-screen">
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <Billboard />
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="pt-24 pb-16 px-4 sm:px-6 md:px-12 lg:px-16 max-w-7xl mx-auto"
      >
        {categories.map((category) => (
          <div key={category.title} className="mb-12">
            <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 tracking-tight">
              {category.title}
            </h2>
            {category.isLoading ? (
              <div className="text-white text-center text-lg">
                <LoadingSpinner />
                <p className="mt-4 text-gray-300">Loading {category.title.toLowerCase()}...</p>
              </div>
            ) : category.error ? (
              <div className="text-red-500 text-center text-lg bg-gray-800 p-6 rounded-lg shadow-lg">
                Error loading {category.title.toLowerCase()}: {category.error.message}
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            ) : category.data.length === 0 ? (
              <MotionDiv
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-white text-center py-6"
              >
                <p className="text-lg md:text-xl text-gray-300">
                  No {category.title.toLowerCase()} available.
                </p>
              </MotionDiv>
            ) : (
              <MovieList
                title={category.title}
                data={category.data}
                isLoading={category.isLoading}
                error={category.error}
              />
            )}
          </div>
        ))}
      </MotionDiv>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default memo(Home);