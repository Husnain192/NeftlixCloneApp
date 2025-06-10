import React, { memo } from 'react';
import { motion } from 'framer-motion';

import Navbar from '@/components/Navbar';
import MovieList from '@/components/MovieList';
import InfoModal from '@/components/InfoModal';
import useFavorites from '@/hooks/useFavorites';
import useInfoModalStore from '@/hooks/useInfoModalStore';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';

const MyList: React.FC = () => {
  const { data: favorites = [], isLoading, error } = useFavorites();
  const { isOpen, closeModal } = useInfoModalStore();

  return (
    <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen">
      <InfoModal visible={isOpen} onClose={closeModal} />
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="pt-24 pb-16 px-4 sm:px-6 md:px-12"
      >
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-8">
          My List
        </h1>
        {isLoading ? (
          <div className="text-white text-center text-lg animate-pulse">
            Loading your favorites...
          </div>
        ) : error ? (
          <div className="text-red-500 text-center text-lg">
            Error loading favorites: {error.message}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white text-center"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-4">
              Your List is Empty
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-md mx-auto">
              Add movies to your list by clicking the heart icon on any title.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-6 bg-red-600 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-red-700 transition"
            >
              Browse Movies
            </button>
          </motion.div>
        ) : (
          <MovieList
            title="Your Favorites"
            data={favorites}
            isLoading={isLoading}
            error={error}
          />
        )}
      </motion.div>
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

export default memo(MyList);